/**
 * @module
 * @description JWT authorize middleware
 */
const jwt = require('jsonwebtoken');
const vault = require('../modules/vault');
const { AuthorizationFailError } = require('../types/errors');

/**
 * @author madgnu
 * @description Extracting token from Bearer-prefixed string
 * @param {String} header Bearer string from header
 * @returns {String} Pure token
 */
const extractBearerToken = (header) => header.replace('Bearer ', '');

/**
 * @author madgnu
 * @description Extract _id from token and bind it to request
 * @param {express.Request} req Request interface
 * @param {String} token JWT string
 */
const setSession = (req, token) => {
  const payload = jwt.verify(token, vault.getSecret('JWT_SECRET'));
  req.user = { _id: payload._id };
};

/**
 * @author madgnu
 * @throws {types.errors.AuthorizationFailError}
 * @description Extract token from authorization header
 */
const bearerStrategy = (req) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) throw new AuthorizationFailError('Invalid authorization header');

  const token = extractBearerToken(authorization);
  setSession(req, token);
};

/**
 * @author madgnu
 * @throws AuthorizationFailError
 * @description Extract token from jwt cookie
 */
const cookieStrategy = (req) => {
  const token = req.cookies.jwt;

  if (!token) throw new AuthorizationFailError('Invalid authorization cookie');
  setSession(req, token);
};

module.exports = (req, res, next) => {
  try {
    const authStrategy = vault.getSecret('AUTH_STRATEGY');
    switch (authStrategy) {
      case 'bearer': bearerStrategy(req); next(); break;
      case 'cookie': cookieStrategy(req); next(); break;
      default: throw new AuthorizationFailError('Unknown authorization strategy');
    }
  } catch (err) {
    next(err);
  }
};
