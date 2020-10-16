/**
 * @module
 * @description JWT authorize middleware
 */
const jwt = require('jsonwebtoken');
const vault = require('../modules/vault');
const CustomErrors = require('../types/errors');
const errorHelper = require('../helpers/errorHelper');

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
 * @description Extract token from authorization header
 * @param {express.Request} req Request interface
 * @param {express.Response} res Response interface
 * @param {express.NextFunction} next Next handler
 */
const bearerStrategy = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    if (!authorization || !authorization.startsWith('Bearer ')) throw new CustomErrors.AuthorizationFailError('Invalid authorization header');

    const token = extractBearerToken(authorization);
    setSession(req, token);
    next();
  } catch (err) {
    errorHelper(err, res);
  }
};

/**
 * @author madgnu
 * @description Extract token from jwt cookie
 * @param {express.Request} req Request interface
 * @param {express.Response} res Response interface
 * @param {express.NextFunction} next Next handler
 */
const cookieStrategy = (req, res, next) => {
  const token = req.cookies.jwt;

  try {
    if (!token) throw new CustomErrors.AuthorizationFailError('Invalid authorization cookie');
    setSession(req, token);
    next();
  } catch (err) {
    errorHelper(err, res);
  }
};

module.exports = (req, res, next) => {
  try {
    const authStrategy = vault.getSecret('AUTH_STRATEGY');
    switch (authStrategy) {
      case 'bearer': bearerStrategy(req, res, next); break;
      case 'cookie': cookieStrategy(req, res, next); break;
      default: throw new CustomErrors.AuthorizationFailError('Unknown authorization strategy');
    }
  } catch (err) {
    errorHelper(err, res);
  }
};
