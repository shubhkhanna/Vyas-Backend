const express = require("express");
const {
  getAllCourses,
  getCourseById,
  createCourse,
} = require("../controllers/courseController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(getAllCourses);
router.route("/:id").get(getCourseById);
router.route("/create").post(authMiddleware, adminMiddleware, createCourse);

module.exports = router;
