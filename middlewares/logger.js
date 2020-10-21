/**
 * @module
 * @description Configurable logger middleware, based on winston
 */
const winston = require('winston');
const expressWinston = require('express-winston');

module.exports = (options = {}) => {
  const {
    loggerType = 'log',
    format = 'json',
    transportType = 'file',
    filename = 'combine.log',
    dirname = 'logs',
  } = options;

  let formater = null;
  switch (format) {
    case 'json': formater = winston.format.json(); break;
    case 'short': formater = winston.format.printf((info) => `${new Date().toISOString()} ${info.message}`); break;
    default: winston.format.json();
  }

  let transport = null;
  switch (transportType) {
    case 'tty': transport = new winston.transports.Console(); break;
    case 'file': transport = new winston.transports.File({ filename, dirname }); break;
    default: transport = new winston.transports.File({ filename: 'request.log', dirname: 'logs' }); break;
  }

  let logger = null;
  switch (loggerType) {
    case 'log': logger = expressWinston.logger; break;
    case 'error': logger = expressWinston.errorLogger; break;
    default: logger = expressWinston.logger;
  }
  return logger({
    transports: [transport],
    format: formater,
    expressFormat: format === 'short',
  });
};
