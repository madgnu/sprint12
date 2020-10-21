/**
 * @module
 * @description Http validation models for users
 */
const { Joi } = require('celebrate');
const validator = require('validator');

const resource = Joi.object().keys({
  userId: Joi.string().required().length(24).hex(),
});

const about = Joi.object().keys({
  name: Joi.string().required().min(2).max(30),
  about: Joi.string().required().min(2).max(30),
});

const avatar = Joi.object().keys({
  avatar: Joi.string().required().custom((url, helpers) => {
    if (validator.isURL(url, { protocols: ['http', 'https'], require_protocol: true })) {
      return url;
    }
    return helpers.message('Wrong URL format');
  }, 'URL Link'),
});

const auth = Joi.object().keys({
  email: Joi.string().required().custom((email, helpers) => {
    if (validator.isEmail(email)) {
      return email;
    }
    return helpers.message('Wrong email format');
  }),
  password: Joi.string().required().regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,15}$/),
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
