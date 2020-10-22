const HttpThrowableError = require('./httpthrowable');

class NotFoundError extends HttpThrowableError {
  constructor(message) {
    super(message, 404, 'Ресурс не найден');
  }
}

module.exports = NotFoundError;
