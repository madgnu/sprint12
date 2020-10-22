const HttpThrowableError = require('./httpthrowable');

class SecretNotFoundError extends HttpThrowableError {
  constructor(message) {
    super(message, 503);
  }
}

module.exports = SecretNotFoundError;
