/**
 * @module
 * @description Module for obtain "higly-secret" information (dummy realization).
 * Only for training
 * You shouldn't ever store secrets in env variables, use specialized software
 * DONT USE THIS APPROACH IN PRODUCTION
 */
const { SecretNotFoundError } = require('../types/errors');

require('dotenv').config();

const { MONGODB_URI = 'mongodb://localhost:27017/mestodb', JWT_SECRET, AUTH_STRATEGY = 'bearer' } = process.env;
const secrets = { MONGODB_URI, JWT_SECRET, AUTH_STRATEGY };

module.exports.init = () => (Boolean(secrets.JWT_SECRET) && Boolean(secrets.AUTH_STRATEGY)) || (process.env.NODE_ENV === 'dev');
module.exports.getSecret = (name) => {
  if (process.env.NODE_ENV === 'production' && !secrets[name]) throw new SecretNotFoundError(`Secret "${name}" not found in vault`);
  return secrets[name] || 'non-secret';
};
