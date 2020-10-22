/**
 * @module
 * @description Mongoose Card model
 */
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const passwordRegexp = require('../../types/regexp-password');
const validateUrl = require('../../helpers/validateUrl');
const { AuthorizationFailError } = require('../../types/errors');

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
   * @description User email
   */
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
    },
  },
  /**
   * @type String
   * @description User password hashed by bcrypt with 12 rounds
   * Password must satisfy all there params:
   * * at least 1 uppercase
   * * at least 1 lowercase
   * * at least 1 number
   * * must contain from 8 to 15 chars
   */
  password: {
    type: String,
    required: true,
    select: false,
    set: (value) => {
      if (!passwordRegexp.test(value)) {
        throw new mongoose.Error.ValidationError();
      }
      return bcrypt.hashSync(value, 12);
    },
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

async function findUserByCredentials(login, password) {
  const user = await this
    .findOne({ email: login })
    .select('+password')
    .orFail(new AuthorizationFailError('User not found'));
  if (!await bcrypt.compare(password, user.password)) throw new AuthorizationFailError('Hash mismatch');
  return user;
}

userSchema.statics.findUserByCredentials = findUserByCredentials;

module.exports = mongoose.model('user', userSchema);
