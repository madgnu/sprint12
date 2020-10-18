/**
 * @module
 * @description User managment router.
 */
const router = require('express').Router();
const userController = require('../controllers/users');

router.post('/signin', userController.login);
router.post('/signup', userController.createUser);

module.exports = router;
