const mongoose = require("mongoose");

const UserPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      lowercase: true,
    },
    fieldOfStudy: {
      type: String,
      required: true,
      lowercase: true,
    },
    timeDuration: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserPreference", UserPreferenceSchema);
