/**
 * @module
 * @description Helps with generate error message to client
 */
const mongoose = require('mongoose');
const CustomErrors = require('../types/errors');

const { NODE_ENV = 'prod' } = process.env;

module.exports = (err, req, res, next) => {
  const errObj = {
    message: 'На сервере произошла ошибка',
  };

  if (NODE_ENV === 'dev') {
    errObj.devData = {
      error: err.toString(),
      message: err.message,
      stack: err.stack,
    };
  }

  if (err instanceof mongoose.Error.ValidationError) {
    errObj.message = 'Ошибка валидации данных';
    res.status(400).send(errObj);
  } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
    errObj.message = 'Данные не найдены';
    res.status(404).send(errObj);
  } else if (err instanceof CustomErrors.AuthorizationFailError || err.name === 'JsonWebTokenError') {
    errObj.message = 'Данные для авторизации недействительны или отсутствуют';
    res.status(401).send(errObj);
  } else if (err instanceof CustomErrors.SecretNotFoundError) {
    errObj.message = 'Сервис временно не доступен';
    res.status(503).send(errObj);
  } else if (err instanceof CustomErrors.OwnerMismatchError) {
    errObj.message = 'У вас нет прав на это действие';
    res.status(403).send(errObj);
  } else if (err.name === 'MongoError' && err.code === 11000) {
    errObj.message = 'Уже существует';
    res.status(409).send(errObj);
  } else {
    res.status(500).send(errObj);
  }

  next();
};
