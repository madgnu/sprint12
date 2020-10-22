/**
 * @module
 * @description Configurable logger middleware, based on winston
 */
const winston = require('winston');
const expressWinston = require('express-winston');

const getFormater = (format) => {
  switch (format) {
    case 'json': return winston.format.json();
    case 'short': return winston.format.printf((info) => `${new Date().toISOString()} ${info.message}`);
    default: return winston.format.json();
  }
};

const getTransport = (transportType, filename, dirname) => {
  switch (transportType) {
    case 'tty': return new winston.transports.Console();
    case 'file': return new winston.transports.File({ filename, dirname });
    default: return new winston.transports.File({ filename: 'request.log', dirname: 'logs' });
  }
};

const getLogger = (loggerType) => {
  switch (loggerType) {
    case 'log': return expressWinston.logger;
    case 'error': return expressWinston.errorLogger;
    default: return expressWinston.logger;
  }
};

module.exports = (options = {}) => {
  const {
    loggerType = 'log',
    format = 'json',
    transportType = 'file',
    filename = 'combine.log',
    dirname = 'logs',
  } = options;

  const logger = getLogger(loggerType);

  return logger({
    transports: [getTransport(transportType, filename, dirname)],
    format: getFormater(format),
    expressFormat: format === 'short',
  });
};
