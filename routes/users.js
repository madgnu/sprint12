/**
 * @module
 * @description Users router.
 */
const router = require('express').Router();
const { celebrate } = require('celebrate');
const userController = require('../controllers/users');
const userHttpValidator = require('../models/http/users');

router.get('/', userController.getUsers);
router.get('/:userId', celebrate(userHttpValidator.resourceUser), userController.getUserById);
router.patch('/me', celebrate(userHttpValidator.aboutUser), userController.updateUser);
router.patch('/me/avatar', celebrate(userHttpValidator.avatarUser), userController.updateAvatar);

module.exports = router;
