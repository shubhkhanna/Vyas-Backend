const jwt = require("jsonwebtoken");

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    algorithm: "HS512",
    expiresIn: "1d",
  });
};

module.exports = { generateToken };
