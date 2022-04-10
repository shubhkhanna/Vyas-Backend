const express = require("express");
const {
  getAllCourses,
  getCourseById,
  createCourse,
  enrollInCourse,
  getAllEnrolledCourses,
} = require("../controllers/courseController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const router = express.Router();

router
  .route("/")
  .get(getAllCourses)
  .post(authMiddleware, adminMiddleware, createCourse);
router.route("/:id").get(getCourseById);
router.route("/enroll").get(authMiddleware, getAllEnrolledCourses);
router.route("/enroll/:id").post(authMiddleware, enrollInCourse);

module.exports = router;
