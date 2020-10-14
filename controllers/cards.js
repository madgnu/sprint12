/**
 * @module
 * @desctiption Cards controller
 */
const Card = require('../models/card');
const errorHelper = require('../helpers/errorHelper');
const validateObjectId = require('../helpers/validateObjectId');

/**
 * @async
 * @author madgnu
 * @description Get all cards from database and response with json object
 * @param {express.Request} req Request interface
 * @param {express.Response} res Response interface
 * @param {express.NextFunction} next Next handler
 */
module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find().populate(['owner', 'likes']);
    res.send(cards);
  } catch (err) {
    errorHelper(err, res);
  }
  next();
};

/**
 * @async
 * @author madgnu
 * @description Create and store new card in database and response with json object
 * @param {express.Request} req Request interface
 * @param {express.Response} res Response interface
 * @param {express.NextFunction} next Next handler
 */
module.exports.createCard = async (req, res, next) => {
  const { name, link } = req.body;

  try {
    const card = await Card.create({ name, link, owner: req.user._id });
    await card.save();
    res.send(card);
  } catch (err) {
    errorHelper(err, res);
  }
  next();
};

/**
 * @async
 * @author madgnu
 * @description Delete card within given :cardId and response within 200 OK on success with message
 * @param {express.Request} req Request interface
 * @param {express.Response} res Response interface
 * @param {express.NextFunction} next Next handler
 */
module.exports.deleteCard = async (req, res, next) => {
  const { cardId } = req.params;

  try {
    validateObjectId(cardId, true);
    const card = await Card.findByIdAndDelete(cardId);
    if (card) {
      res.send({ message: 'Карточка удалена' });
    } else {
      res.status(404).send({ message: 'Карточка не найдена' });
    }
  } catch (err) {
    errorHelper(err, res);
  }
  next();
};

/**
 * @async
 * @author madgnu
 * @description Add like to card within given :cardId
 * @param {express.Request} req Request interface
 * @param {express.Response} res Response interface
 * @param {express.NextFunction} next Next handler
 */
module.exports.likeCard = async (req, res, next) => {
  const { cardId } = req.params;

  try {
    validateObjectId(cardId, true);
    const card = await Card.findByIdAndUpdate(cardId,
      {
        $addToSet: {
          likes: req.user._id,
        },
      },
      { new: true }).populate(['owner', 'likes']);
    if (card) {
      res.send(card);
    } else {
      res.status(404).send({ message: 'Карточка не найдена' });
    }
  } catch (err) {
    errorHelper(err, res);
  }
  next();
};


/**
 * @async
 * @author madgnu
 * @description Removes like to card within given :cardId
 * @param {express.Request} req Request interface
 * @param {express.Response} res Response interface
 * @param {express.NextFunction} next Next handler
 */
module.exports.dislikeCard = async (req, res, next) => {
  const { cardId } = req.params;

  try {
    validateObjectId(cardId, true);
    const card = await Card.findByIdAndUpdate(cardId,
      {
        $pull: {
          likes: req.user._id,
        },
      },
      { new: true }).populate(['owner', 'likes']);
    if (card) {
      res.send(card);
    } else {
      res.status(404).send({ message: 'Карточка не найдена' });
    }
  } catch (err) {
    errorHelper(err, res);
  }
  next();
};
