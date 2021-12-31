let otp = "";

const generateOTP = () => {
  for (let i = 0; i < 6; i++) {
    otp += Math.round(Math.random() * 8);
  }
  return otp;
};

module.exports = { generateOTP };
