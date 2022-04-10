const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true,
      lowercase: true,
    },
    courseInstructor: {
      type: String,
      required: true,
      lowercase: true,
    },
    courseCode: {
      type: String,
      required: true,
      unique: true,
    },
    courseDescription: {
      type: String,
      required: true,
      lowercase: true,
    },
    courseDuration: {
      type: String,
      required: true,
    },
    courseUrl: {
      type: String,
      required: true,
    },
    courseImageUrl: {
      type: String,
      required: true,
    },
    courseCategory: {
      type: String,
      required: true,
      lowercase: true,
    },
    courseLevel: {
      type: String,
      required: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course", CourseSchema);
