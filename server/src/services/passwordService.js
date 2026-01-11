const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

exports.hashPassword = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

exports.comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};