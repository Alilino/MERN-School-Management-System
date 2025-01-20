// First, create a counter schema for auto-incrementing roll numbers
const mongoose = require("mongoose");

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

// Modified student schema
const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rollNum: {
      type: Number,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    sclassName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sclass",
      required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
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
          ref: "subject",
        },
        marksObtained: {
          type: Number,
          default: 0,
        },
      },
    ],
    attendance: [
      {
        attendanceDate: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "sclass.attendanceDates",
        },
        status: {
          type: String,
          enum: ["Present", "Absent", "Sick"],
          required: true,
        },
        subName: {
          type: String,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

studentSchema.pre('save', async function (next) {
  const doc = this;
  if (doc.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'rollNum' },
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
      );
      doc.rollNum = counter.sequence_value;
    } catch (error) {
      return next(error);
    }
  }
  next();
});

module.exports = mongoose.model("student", studentSchema);