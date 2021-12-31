const mongoose = require("mongoose");

const VerificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "3600", // 1 Hour
  },
});

module.exports = mongoose.model("Verification", VerificationSchema);
