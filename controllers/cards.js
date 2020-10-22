/**
 * @module
 * @description Cards controller
 */
const Card = require('../models/database/card');
const { OwnerMismatchError } = require('../types/errors');

const touchLike = async (updateMode, req, res, next) => {
  const { cardId } = req.params;

  try {
    const card = await Card.findByIdAndUpdate(cardId,
      {
        [updateMode]: {
          likes: req.user._id,
        },
      },
      { new: true }).populate(['owner', 'likes'])
      .orFail();
    res.send(card);
  } catch (err) {
    next(err);
  }
};

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
    next(err);
  }
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
    res.send(card);
  } catch (err) {
    next(err);
  }
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
  const userId = req.user._id;

  try {
    const card = await Card.findById(cardId).orFail();
    if (String(card.owner) !== userId) throw new OwnerMismatchError(`Owner mismatch: expect ${userId} but found ${card.owner}`, 'Эта карточка вам не принадлежит');
    await card.deleteOne();
    res.send(card);
  } catch (err) {
    next(err);
  }
};

/**
 * @async
 * @author madgnu
 * @description Add like to card within given :cardId
 * @param {express.Request} req Request interface
 * @param {express.Response} res Response interface
 * @param {express.NextFunction} next Next handler
 */
module.exports.likeCard = async (req, res, next) => touchLike('$addToSet', req, res, next);

/**
 * @async
 * @author madgnu
 * @description Removes like to card within given :cardId
 * @param {express.Request} req Request interface
 * @param {express.Response} res Response interface
 * @param {express.NextFunction} next Next handler
 */
module.exports.dislikeCard = async (req, res, next) => touchLike('$pull', req, res, next);
