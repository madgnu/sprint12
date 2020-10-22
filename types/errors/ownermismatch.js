const HttpThrowableError = require('./httpthrowable');

class OwnerMismatchError extends HttpThrowableError {
  constructor(message, publicMessage) {
    super(message, 403, publicMessage);
  }
}

module.exports = OwnerMismatchError;
