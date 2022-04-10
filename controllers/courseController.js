const asyncHandler = require("express-async-handler");

const Course = require("../models/courseModel");
const UserCourse = require("../models/userCourseModel");

// @desc Get all courses
// @route GET /v1/courses
// @access PUBLIC
const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({}).sort({ createdAt: -1 });

  res.json(courses);
});

// @desc Get course by course code
// @route GET /v1/courses/:id
// @access PUBLIC
const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ courseCode: req.params.id });

  if (course) {
    res.json(course);
  } else {
    res.status(404);
    throw new Error("Course not found!");
  }
});

// @desc Create course
// @route POST /v1/courses
// @access PRIVATE/Admin
const createCourse = asyncHandler(async (req, res) => {
  const {
    courseName,
    courseInstructor,
    courseDescription,
    courseDuration,
    courseUrl,
    courseImageUrl,
    courseCategory,
    courseLevel,
  } = req.body;

  const courseCount = await Course.countDocuments();

  const course = new Course({
    courseName,
    courseInstructor,
    courseCode: "VYAS_" + (courseCount + 1),
    courseDescription,
    courseDuration,
    courseUrl,
    courseImageUrl,
    courseCategory,
    courseLevel,
  });

  await course.save();

  if (course) {
    res.status(201).json(course);
  } else {
    res.status(401);
    throw new Error("Invalid course data!");
  }
});

// @desc Get all enrolled courses by user
// @route GET /v1/courses/enroll
// @access PRIVATE
const getAllEnrolledCourses = asyncHandler(async (req, res) => {
  const userCourses = await UserCourse.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });

  if (userCourses) {
    res.json(userCourses);
  } else {
    res.json({ message: "No courses found!" });
  }
});

// @desc Enroll user in course by course id
// @route POST /v1/courses/enroll/:id
// @access PRIVATE
const enrollInCourse = asyncHandler(async (req, res) => {
  // Finding the course
  const course = await Course.findById(req.params.id);

  // Checking if course exists
  if (!course) {
    res.status(404);
    throw new Error("Course not found!");
  }

  // Checking if user already enrolled in the course
  const userCourse = await UserCourse.findOne({
    $and: [{ userId: req.user._id }, { courseId: req.params.id }],
  });

  if (userCourse) {
    res.status(400);
    throw new Error("You are already enrolled in this course!");
  }

  // Creating a new user course
  const newUserCourse = new UserCourse({
    userId: req.user._id,
    courseId: req.params.id,
  });

  await newUserCourse.save();

  res.status(201).json({
    message: "You have successfully enrolled in this course!",
  });
});

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  enrollInCourse,
  getAllEnrolledCourses,
};
