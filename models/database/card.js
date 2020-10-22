/**
 * @module
 * @description Mongoose Card model
 */
const mongoose = require('mongoose');

const validateUrl = require('../../helpers/validateUrl');

const cardSchema = new mongoose.Schema({
  /**
   * @type String
   * @description Card name, required string from 2-30 symbols
   */
  name: {
    type: mongoose.Schema.Types.String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  /**
   * @type String
   * @description Link to card image url.
   */
  link: {
    type: mongoose.Schema.Types.String,
    required: true,
    validate: {
      validator: validateUrl,
    },
  },
  /**
   * @type mongoose.Schema.Types.ObjectId
   * @description Card owner
   */
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  },
  /**
   * @type Array
   * @description Array of users, who gives like to card
   */
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'user',
  }],
  /**
   * @type Date
   * @description Creation date of card
   */
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('card', cardSchema);
