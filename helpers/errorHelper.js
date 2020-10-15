/**
 * @module
 * @description Helps with generate error message to client
 */
const mongoose = require('mongoose');

const { NODE_ENV = 'prod' } = process.env;

module.exports = (err, res) => {
  const errObj = {
    message: err.toString(),
  };

  if (NODE_ENV === 'dev') {
    errObj.error = err.toString();
    errObj.stack = err.stack;
  }

  if (err instanceof mongoose.Error.ValidationError) {
    errObj.message = 'Ошибка валидации данных';
    res.status(400).send(errObj);
  } else {
    errObj.message = 'На сервере произошла ошибка';
    res.status(500).send(errObj);
  }
};
