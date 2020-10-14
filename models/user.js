/**
 * @module
 * @description Mongoose Card model
 */
const mongoose = require('mongoose');
const validateUrl = require('../helpers/validateUrl');

const userSchema = new mongoose.Schema({
  /**
   * @type String
   * @description User name
   */
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  /**
   * @type String
   * @description About field
   */
  about: {
    type: mongoose.Schema.Types.String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  /**
   * @type String
   * @description URL to user's avatar image
   */
  avatar: {
    type: mongoose.Schema.Types.String,
    required: true,
    validate: {
      validator: validateUrl,
    },
  },
});

module.exports = mongoose.model('user', userSchema);
