/**
 * @module
 * @description Cards router.
 */
const router = require('express').Router();
const { celebrate } = require('celebrate');
const cardController = require('../controllers/cards');
const cardHttpValidator = require('../models/http/cards');

router.get('/', cardController.getCards);
router.post('/', celebrate(cardHttpValidator.createCard), cardController.createCard);
router.delete('/:cardId', celebrate(cardHttpValidator.resourceCard), cardController.deleteCard);
router.put('/:cardId/likes', celebrate(cardHttpValidator.resourceCard), cardController.likeCard);
router.delete('/:cardId/likes', celebrate(cardHttpValidator.resourceCard), cardController.dislikeCard);

module.exports = router;
