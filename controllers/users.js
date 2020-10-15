/**
 * @module controllers/user
 * @description Users controller
 */
const User = require('../models/user');
const errorHelper = require('../helpers/errorHelper');
const validateObjectId = require('../helpers/validateObjectId');

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
    errorHelper(err, res);
  }
  next();
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
    validateObjectId(userId, true);
    const user = await User.findById(userId);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'Пользователь не найден' });
    }
  } catch (err) {
    errorHelper(err, res);
  }
  next();
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
  const { name, about, avatar } = req.body;

  try {
    const user = await User.create({ name, about, avatar });
    await user.save();
    res.send(user);
  } catch (err) {
    errorHelper(err, res);
  }
  next();
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
    );
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'Пользователь не найден' });
    }
  } catch (err) {
    errorHelper(err, res);
  }
  next();
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
    );
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'Пользователь не найден' });
    }
  } catch (err) {
    errorHelper(err, res);
  }
  next();
};
