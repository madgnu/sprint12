/**
 * @module
 * @description Helps with generate error message to client
 */
const mongoose = require('mongoose');
const { HttpThrowableError } = require('../types/errors');

module.exports = (env) => (err, req, res, next) => {
  const errObj = {
    message: 'На сервере произошла ошибка',
  };
  let responseCode = 500;

  if (env === 'dev') {
    errObj.devData = {
      error: err.toString(),
      message: err.message,
      stack: err.stack,
    };
  }

  if (err instanceof HttpThrowableError) {
    responseCode = err.statusCode;
    errObj.message = err.publicOutput;
  } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
    responseCode = 404;
    errObj.message = 'Данные не найдены';
  } else if (err.name === 'MongoError' && err.code === 11000) {
    responseCode = 409;
    errObj.message = 'Уже существует';
  } else if (err.name === 'JsonWebTokenError') {
    responseCode = 401;
    errObj.message = 'Данные для авторизации недействительны или отсутствуют';
  }

  res.status(responseCode).send(errObj);
  next();
};
