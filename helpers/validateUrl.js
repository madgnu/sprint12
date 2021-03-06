/**
 * @module
 * @description Validates URL with validator prackage implementation
 */
const validator = require('validator');

module.exports = (url) => validator.isURL(url, {
  protocols: ['http', 'https'],
  require_protocol: true,
});
