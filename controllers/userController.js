const asyncHandler = require("express-async-handler");
const { isValidObjectId } = require("mongoose");
const { hashToken, compareToken } = require("../helpers/bcryptHelper");
const { generateToken } = require("../helpers/generateToken");

const User = require("../models/userModel");
const UserPreference = require("../models/userPreferenceModel");

// @decs Create User
// @route POST /v1/user/register
// @access PUBLIC
const registerUser = asyncHandler(async (req, res) => {
  // Get Data From Request
  const { name, email, password } = req.body;

  //   Check if User Exists
  const user = await User.findOne({ email });

  //   If User Exists
  if (user) {
    res.status(400);
    throw new Error("Email Already Exists!");
  }

  //   Creating a new user
  const newUser = new User({
    name,
    email,
    password: await hashToken(password),
  });

  await newUser.save();

  // Sending response
  res.status(201).json({
    token: generateToken(newUser._id),
  });
});

// @decs Verify User & Get Token
// @route POST /v1/user/login
// @access PUBLIC
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //   Check if User Exists
  const user = await User.findOne({ email });

  //   If User Does Not Exist
  if (!user) {
    res.status(404);
    throw new Error("User not found!");
  }

  //  Check if Password is correct
  const isMatched = await compareToken(password, user.password);

  //  If Password is incorrect
  if (!isMatched) {
    res.status(401);
    throw new Error("Incorrect Email or Password!");
  }

  // Sending response
  res.json({
    token: generateToken(user._id),
  });
});

// @desc Get User Profile
// @route GET /v1/user/profile
// @access PRIVATE
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User Not Found!");
  }

  // Sending response
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
  });
});

// @desc Add User Preferences
// @route POST /v1/user/preferences
// @access PRIVATE
const addUserPreferences = asyncHandler(async (req, res) => {
  const { age, status, fieldOfStudy, timeDuration } = req.body;

  // Check if user id is not valid
  if (!isValidObjectId(req.user._id)) {
    res.status(400);
    throw new Error("Invalid User Id!");
  }

  const user = await User.findById(req.user._id);

  // If User Does Not Exist
  if (!user) {
    res.status(404);
    throw new Error("User not found!");
  }

  // Add Preferences to User
  const userPreference = new UserPreference({
    userId: user._id,
    age,
    status,
    fieldOfStudy,
    timeDuration,
  });

  await userPreference.save();

  // Sending response
  res.json({
    message: "Preferences Added Successfully!",
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  addUserPreferences,
};
