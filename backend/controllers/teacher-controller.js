const bcrypt = require('bcrypt');
const Teacher = require('../models/teacherSchema.js');
const Subject = require('../models/subjectSchema.js');

const teacherRegister = async (req, res) => {
    const { name, email, password, role, school, teachSclass, subjects } = req.body;
    try {
        // Check for existing teacher
        const existingTeacherByEmail = await Teacher.findOne({ email });
        if (existingTeacherByEmail) {
            return res.send({ message: 'Email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);

        // Create teacher with initial class and subjects
        const teacher = new Teacher({
            name,
            email,
            password: hashedPass,
            role,
            school,
            classSubjects: [{
                class: teachSclass,
                subjects: subjects || [] // Array of subject IDs
            }]
        });

        // Save teacher
        let result = await teacher.save();

        // Update subjects with teacher reference
        if (subjects && subjects.length > 0) {
            await Subject.updateMany(
                { _id: { $in: subjects } },
                { $set: { teacher: teacher._id } }
            );
        }

        // Remove password from response
        const { password: _, ...teacherData } = result._doc;

        // Populate and send response
        const populatedTeacher = await Teacher.findById(result._id)
            .populate("classSubjects.class", "sclassName")
            .populate("classSubjects.subjects", "subName");

        res.send(populatedTeacher);

    } catch (err) {
        console.error('Teacher registration error:', err);
        res.status(500).json({ message: 'Error registering teacher', error: err.message });
    }
};

const teacherLogIn = async (req, res) => {
    try {
        let teacher = await Teacher.findOne({ email: req.body.email });
        if (teacher) {
            const validated = await bcrypt.compare(req.body.password, teacher.password);
            if (validated) {
                teacher = await teacher.populate("teachSubject", "subName sessions")
                teacher = await teacher.populate("school", "schoolName")
                teacher = await teacher.populate("teachSclass", "sclassName")
                teacher.password = undefined;
                res.send(teacher);
            } else {
                res.send({ message: "Invalid password" });
            }
        } else {
            res.send({ message: "Teacher not found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeachers = async (req, res) => {
    try {
        let teachers = await Teacher.find({ school: req.params.id })
            .populate("classSubjects.class", "sclassName")
            .populate("classSubjects.subjects", "subName");

        if (teachers.length > 0) {
            const modifiedTeachers = teachers.map((teacher) => {
                const { password, ...teacherData } = teacher._doc;
                return teacherData;
            });
            res.send(modifiedTeachers);
        } else {
            res.send({ message: "No teachers found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const getTeacherDetail = async (req, res) => {
    try {
        let teacher = await Teacher.findById(req.params.id)
            .populate("school", "schoolName")
            .populate("classSubjects.class", "sclassName")
            .populate("classSubjects.subjects", "subName sessions");

        if (teacher) {
            const { password, ...teacherData } = teacher._doc;
            res.send(teacherData);
        } else {
            res.send({ message: "No teacher found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};

const updateTeacherSubject = async (req, res) => {
    const { teacherId, teachSubject } = req.body;
    
    try {
        // First, get the subject details to know which class it belongs to
        const subject = await Subject.findById(teachSubject)
            .populate('sclassName')
            .lean();

        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        // Find the teacher
        const teacher = await Teacher.findById(teacherId);
        
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // Check if the teacher already has this class in their classSubjects
        const existingClassIndex = teacher.classSubjects.findIndex(
            cs => cs.class.toString() === subject.sclassName._id.toString()
        );

        if (existingClassIndex >= 0) {
            // Class exists, check if subject is already added
            const subjects = teacher.classSubjects[existingClassIndex].subjects;
            if (!subjects.includes(subject._id)) {
                // Add the subject to existing class
                teacher.classSubjects[existingClassIndex].subjects.push(subject._id);
            }
        } else {
            // Class doesn't exist, add new class with subject
            teacher.classSubjects.push({
                class: subject.sclassName._id,
                subjects: [subject._id]
            });
        }

        // Save the updated teacher
        const updatedTeacher = await teacher.save();

        // Update the subject with the teacher reference
        await Subject.findByIdAndUpdate(
            teachSubject,
            { teacher: teacherId },
            { new: true }
        );

        // Populate the response data
        const populatedTeacher = await Teacher.findById(updatedTeacher._id)
            .populate('classSubjects.class')
            .populate('classSubjects.subjects')
            .lean();

        res.json(populatedTeacher);

    } catch (error) {
        console.error('Error in updateTeacherSubject:', error);
        res.status(500).json({ 
            message: "Error updating teacher subject",
            error: error.message 
        });
    }
};

const deleteTeacher = async (req, res) => {
    try {
        const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);

        await Subject.updateOne(
            { teacher: deletedTeacher._id, teacher: { $exists: true } },
            { $unset: { teacher: 1 } }
        );

        res.send(deletedTeacher);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachers = async (req, res) => {
    try {
        const deletionResult = await Teacher.deleteMany({ school: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            res.send({ message: "No teachers found to delete" });
            return;
        }

        const deletedTeachers = await Teacher.find({ school: req.params.id });

        await Subject.updateMany(
            { teacher: { $in: deletedTeachers.map(teacher => teacher._id) }, teacher: { $exists: true } },
            { $unset: { teacher: "" }, $unset: { teacher: null } }
        );

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteTeachersByClass = async (req, res) => {
    try {
        const deletionResult = await Teacher.deleteMany({ sclassName: req.params.id });

        const deletedCount = deletionResult.deletedCount || 0;

        if (deletedCount === 0) {
            res.send({ message: "No teachers found to delete" });
            return;
        }

        const deletedTeachers = await Teacher.find({ sclassName: req.params.id });

        await Subject.updateMany(
            { teacher: { $in: deletedTeachers.map(teacher => teacher._id) }, teacher: { $exists: true } },
            { $unset: { teacher: "" }, $unset: { teacher: null } }
        );

        res.send(deletionResult);
    } catch (error) {
        res.status(500).json(error);
    }
};

const teacherAttendance = async (req, res) => {
    const { status, date } = req.body;

    try {
        const teacher = await Teacher.findById(req.params.id);

        if (!teacher) {
            return res.send({ message: 'Teacher not found' });
        }

        const existingAttendance = teacher.attendance.find(
            (a) =>
                a.date.toDateString() === new Date(date).toDateString()
        );

        if (existingAttendance) {
            existingAttendance.status = status;
        } else {
            teacher.attendance.push({ date, status });
        }

        const result = await teacher.save();
        return res.send(result);
    } catch (error) {
        res.status(500).json(error)
    }
};

module.exports = {
    teacherRegister,
    teacherLogIn,
    getTeachers,
    getTeacherDetail,
    updateTeacherSubject,
    deleteTeacher,
    deleteTeachers,
    deleteTeachersByClass,
    teacherAttendance
};