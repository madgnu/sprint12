/* eslint-disable global-require */
module.exports = {
  AuthorizationFailError: require('./errors/authorizationfail'),
  SecretNotFoundError: require('./errors/secretnotfound'),
  OwnerMismatchError: require('./errors/ownermismatch'),
};
