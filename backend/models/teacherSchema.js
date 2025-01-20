const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "Teacher"
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    classSubjects: [{
        class: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'sclass',
            required: true
        },
        subjects: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'subject'
        }]
    }],
    attendance: [{
        date: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            enum: ['present', 'absent', 'half-day', 'leave'],
            required: true
        },
        timeIn: Date,
        timeOut: Date,
        leaveReason: String,
        leaveType: {
            type: String,
            enum: ['sick', 'casual', 'emergency', 'other']
        }
    }]
}, { timestamps: true });

// Indexes for efficient querying
teacherSchema.index({ 'classSubjects.class': 1, 'classSubjects.subjects': 1 });
teacherSchema.index({ 'attendance.date': 1, 'attendance.status': 1 });

module.exports = mongoose.model("teacher", teacherSchema);