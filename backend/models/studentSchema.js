const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({

    rollNum: {
        type: Number,
        required: true,
    },

    password: {
        type: String,
        required: true,
    },
    sclassName: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sclass',
        required: true,
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'admin',
        required: true,
    },
    role: {
        type: String,
        default: "Student",
    },

    dateOfBirth: {
        type: Date,
    },

    fatherName: {
        type: String,
    },

    fatherPhone: {
        type: String,
    },

    fatherEmail: {
        type: String,
    },

    motherName: {
        type: String,
    },

    motherPhone: {
        type: String,
    },

    motherEmail: {
        type: String,
    },

    emergencyPhone: {
        type: String,
    },

    active: {
        type: Boolean,
        default: true,
    },

    examResult: [
        {
            subName: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'subject',
            },
            marksObtained: {
                type: Number,
                default: 0,
            },
        },
    ],
    attendance: [
        {
            date: {
                type: Date,
                required: true,
            },
            status: {
                type: String,
                enum: ['Present', 'Absent', 'Sick'],
                required: true,
            },
            subName: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'subject',
                required: true,
            },
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model("student", studentSchema);