/**
 * @module
 * @description Users router.
 */
const router = require('express').Router();
const userController = require('../controllers/users');

router.get('/', userController.getUsers);
router.get('/:userId', userController.getUserById);
router.patch('/me', userController.updateUser);
router.patch('/me/avatar', userController.updateAvatar);

module.exports = router;
