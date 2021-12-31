const bcrypt = require('bcrypt');
const saltRounds = 10;

const hashToken = async token => {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(token, salt);
  return hashedPassword;
};

const compareToken = async (token, hashedToken) => {
  const isMatch = await bcrypt.compareSync(token, hashedToken);
  return isMatch;
};

module.exports = {
  hashToken,
  compareToken,
};
