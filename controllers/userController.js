const asyncHandler = require('express-async-handler');
const {isValidObjectId} = require('mongoose');
const sendGridMail = require('@sendgrid/mail');
const {hashToken, compareToken} = require('../helpers/bcryptHelper');
const {generateOTP} = require('../helpers/generateOTP');
const {generateToken} = require('../helpers/generateToken');
const {mailTemplate} = require('../helpers/mailTemplate');
const User = require('../models/userModel');
const Verification = require('../models/verificationModel');

sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

// @decs Create User
// @route POST /v1/user/register
// @access PUBLIC
const registerUser = asyncHandler(async (req, res) => {
  // Get Data From Request
  const {name, email, password} = req.body;

  //   Check if User Exists
  const user = await User.findOne({email});

  //   If User Exists
  if (user) {
    res.status(400);
    throw new Error('Email Already Exists!');
  }

  //   Creating a new user
  const newUser = new User({
    name,
    email,
    password: await hashToken(password),
  });

  // Generate OTP
  const OTP = generateOTP();

  // Save OTP to DB
  const verifyUser = new Verification({
    userId: newUser._id,
    token: await hashToken(OTP),
  });

  await verifyUser.save();
  await newUser.save();

  // Send Email
  try {
    sendGridMail.send(mailTemplate(OTP, newUser.email));
    res.status(201);
    console.log(`Verification mail sent to ${newUser.email}`);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }

  // Sending response
  res.status(201).json({
    token: generateToken(newUser._id),
  });
});

// @decs Verify User & Get Token
// @route POST /v1/user/login
// @access PUBLIC
const loginUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body;

  //   Check if User Exists
  const user = await User.findOne({email});

  //   If User Does Not Exist
  if (!user) {
    res.status(404);
    throw new Error('User not found!');
  }

  //  Check if Password is correct
  const isMatched = await compareToken(password, user.password);

  //  If Password is incorrect
  if (!isMatched) {
    res.status(401);
    throw new Error('Incorrect Email or Password!');
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
  const user = await User.findById(req.user.userId).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User Not Found!');
  }

  // Sending response
  res.json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isVerified: user.isVerified,
    },
  });
});

// @desc Verify User Email
// @route POST /v1/user/verify
// @access PUBLIC
const verifyUser = asyncHandler(async (req, res) => {
  const {userId, otp} = req.body;

  // Check if user id is not valid
  if (!isValidObjectId(userId)) {
    res.status(400);
    throw new Error('Invalid User Id!');
  }

  const user = await User.findById(userId);

  //   If User Does Not Exist
  if (!user) {
    res.status(404);
    throw new Error('User not found!');
  }

  // If User is already verified
  if (user.isVerified) {
    res.status(400);
    throw new Error('Account is already verified!');
  }

  const oldUser = await Verification.findOne({userId: user._id});

  // If token does not exist
  if (!oldUser) {
    res.status(404);
    throw new Error('User not found!');
  }

  //  Check if token is correct
  const isMatched = await compareToken(otp, oldUser.token);

  // If token is incorrect
  if (!isMatched) {
    res.status(401);
    throw new Error('Incorrect OTP!');
  }

  // Update User
  user.isVerified = true;

  await Verification.findByIdAndDelete(oldUser._id);
  await user.save();

  // Sending response
  res.json({
    message: 'Account Verified Successfully!',
    user: {
      isVerified: user.isVerified,
    },
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  verifyUser,
};
