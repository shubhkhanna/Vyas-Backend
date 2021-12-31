const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  verifyUser,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  validateRegisterData,
  validateLoginData,
  validate,
  validateUserData,
} = require("../middleware/userMiddleware");

router.route("/register").post(validateRegisterData, validate, registerUser);
router.route("/login").post(validateLoginData, validate, loginUser);
router.route("/profile").get(authMiddleware, getUserProfile);
router.route("/verify").post(validateUserData, validate, verifyUser);

module.exports = router;
