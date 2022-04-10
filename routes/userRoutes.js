const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  addUserPreferences,
} = require("../controllers/userController");
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  validateRegisterData,
  validateLoginData,
  validate,
} = require("../middleware/userMiddleware");

router.route("/register").post(validateRegisterData, validate, registerUser);
router.route("/login").post(validateLoginData, validate, loginUser);
router.route("/profile").get(authMiddleware, getUserProfile);
router.route("/preferences").post(authMiddleware, addUserPreferences);

module.exports = router;
