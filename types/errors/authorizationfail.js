const HttpThrowableError = require('./httpthrowable');

class AuthorizationFailError extends HttpThrowableError {
  constructor(message) {
    super(message, 401, 'Данные для авторизации недействительны или отсутствуют');
  }
}

module.exports = AuthorizationFailError;
