/**
 * @module
 * @description Http validation models for cards
 */
const { Joi } = require('celebrate');
const validator = require('validator');

module.exports.createCard = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom((url, helpers) => {
      if (validator.isURL(url, { protocols: ['http', 'https'], require_protocol: true })) {
        return url;
      }
      return helpers.message('Wrong URL format');
    }, 'URL Link'),
  }),
};

module.exports.resourceCard = {
  params: Joi.object().keys({
    cardId: Joi.string().required().length(24).hex(),
  }),
};
