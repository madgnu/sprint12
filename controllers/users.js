/**
 * @module
 * @description Users controller
 */
const jwt = require('jsonwebtoken');
const vault = require('../modules/vault');
const User = require('../models/database/user');
const { AuthorizationFailError } = require('../types/errors');

/**
 * @async
 * @author madgnu
 * @description Get users from database and response with json object
 * @param {express.Request} req Request interface
 * @param {express.Response} res Response interface
 * @param {express.NextFunction} next Next handler
 */
module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (err) {
    next(err);
  }
};

/**
 * @async
 * @author madgnu
 * @description Get users within given :cardId from database and response with json object
 * @param {express.Request} req Request interface
 * @param {express.Response} res Response interface
 * @param {express.NextFunction} next Next handler
 */
module.exports.getUserById = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).orFail();
    res.send(user);
  } catch (err) {
    next(err);
  }
};

/**
 * @async
 * @author madgnu
 * @description Create and stores new user in database and response with json object
 * @param {express.Request} req Request interface
 * @param {express.Response} res Response interface
 * @param {express.NextFunction} next Next handler
 */
module.exports.createUser = async (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  try {
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password,
    });
    res.send({
      _id: user._id,
      name,
      about,
      avatar,
      email,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @async
 * @author madgnu
 * @description Login procedure, generates 7d JWT token on success
 * @param {express.Request} req Request interface
 * @param {express.Response} res Response interface
 * @param {express.NextFunction} next Next handler
 */
module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, vault.getSecret('JWT_SECRET'), { expiresIn: '7d' });

    const authStrategy = vault.getSecret('AUTH_STRATEGY');
    switch (authStrategy) {
      case 'bearer': res.send({ token }); break;
      case 'cookie': {
        res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true });
        res.send({ message: 'Authorized' });
        break;
      }
      default: throw new AuthorizationFailError('Unknown authorization strategy');
    }
  } catch (err) {
    next(err);
  }
};

/**
 * @async
 * @author madgnu
 * @description Update user with given name and about fields
 * @param {express.Request} req Request interface
 * @param {express.Response} res Response interface
 * @param {express.NextFunction} next Next handler
 */
module.exports.updateUser = async (req, res, next) => {
  const { name, about } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    ).orFail();
    res.send(user);
  } catch (err) {
    next(err);
  }
};

/**
 * @async
 * @author madgnu
 * @description Updates user avatar link
 * @param {express.Request} req Request interface
 * @param {express.Response} res Response interface
 * @param {express.NextFunction} next Next handler
 */
module.exports.updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    ).orFail();
    res.send(user);
  } catch (err) {
    next(err);
  }
};
