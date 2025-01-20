const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    subName: {
        type: String,
        required: true,
        unique: true
    },
    subCode: {
        type: String,
    },
    beginTime: {
        type: String,
        required: true,
    },
    endTime: {
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
        ref: 'admin'
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teacher',
    }
}, {
    timestamps: true
});
function generateSubjectCode(subName) {
    const parts = subName.split(/[\s-]+/);

    const lastPart = parts[parts.length - 1];
    const hasNumber = /\d+$/.test(lastPart);

    let code = '';

    if (hasNumber) {
        for (let i = 0; i < parts.length - 1; i++) {
            code += parts[i].substring(0, 2);
        }
        code += '-' + lastPart;
    } else {
        for (let i = 0; i < parts.length; i++) {
            code += parts[i].substring(0, 2);
        }
    }

    return code.charAt(0).toUpperCase() + code.slice(1);
}

subjectSchema.pre('save', function (next) {
    if (this.isModified('subName')) {
        this.subCode = generateSubjectCode(this.subName);
    }
    next();
});

module.exports = mongoose.model("subject", subjectSchema);