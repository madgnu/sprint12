/* eslint-disable global-require */
module.exports = {
  HttpThrowableError: require('./errors/httpthrowable'),
  AuthorizationFailError: require('./errors/authorizationfail'),
  SecretNotFoundError: require('./errors/secretnotfound'),
  OwnerMismatchError: require('./errors/ownermismatch'),
  NotFoundError: require('./errors/notfound'),
};
