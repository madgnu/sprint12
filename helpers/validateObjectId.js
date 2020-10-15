const mongoose = require('mongoose');

module.exports = (str, throwErr = false) => {
  const isValid = mongoose.Types.ObjectId.isValid(str);
  if (throwErr && !isValid) throw new mongoose.Error.ValidationError();
  return isValid;
};
