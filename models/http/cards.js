/**
 * @module
 * @description Http validation models for cards
 */
const { Joi } = require('celebrate');
const joiCompositions = require('../../types/joi-compositions');

module.exports.createCard = {
  body: Joi.object().keys({
    name: joiCompositions.commonField,
    link: joiCompositions.url,
  }),
};

module.exports.resourceCard = {
  params: Joi.object().keys({
    cardId: joiCompositions.objectId,
  }),
};
