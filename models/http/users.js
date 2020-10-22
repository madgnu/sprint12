/**
 * @module
 * @description Http validation models for users
 */
const { Joi } = require('celebrate');
const joiCompositions = require('../../types/joi-compositions');

const resource = Joi.object().keys({
  userId: joiCompositions.objectId,
});

const about = Joi.object().keys({
  name: joiCompositions.commonField,
  about: joiCompositions.commonField,
});

const avatar = Joi.object().keys({
  avatar: joiCompositions.url,
});

const auth = Joi.object().keys({
  email: Joi.string().required().email(),
  password: joiCompositions.password,
});

module.exports.resourceUser = {
  params: resource,
};

module.exports.aboutUser = {
  body: about,
};

module.exports.avatarUser = {
  body: avatar,
};

module.exports.authUser = {
  body: auth,
};

module.exports.createUser = {
  body: auth.concat(about).concat(avatar),
};
