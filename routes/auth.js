/**
 * @module
 * @description User managment router.
 */
const router = require('express').Router();
const { celebrate } = require('celebrate');
const userController = require('../controllers/users');
const userHttpValidator = require('../models/http/users');

router.post('/signin', celebrate(userHttpValidator.authUser), userController.login);
router.post('/signup', celebrate(userHttpValidator.createUser), userController.createUser);

module.exports = router;
