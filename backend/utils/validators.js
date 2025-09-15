// utils/validators.js
exports.validateName = (name) => {
  if (typeof name !== "string") return false;
  const len = name.trim().length;
  return len >= 20 && len <= 60;
};

exports.validateEmail = (email) => {
  if (typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

exports.validatePassword = (password) => {
  if (typeof password !== "string") return false;
  // 8-16 chars, at least one uppercase, at least one special character
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
  return passwordRegex.test(password);
};

exports.validateAddress = (address) => {
  if (typeof address !== "string") return false;
  return address.trim().length <= 400;
};
