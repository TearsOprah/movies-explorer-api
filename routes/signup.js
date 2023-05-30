const router = require('express').Router();

const { registerUserValidator } = require('../utils/validation');

const { registerUser } = require('../controllers/users');

router.post('/signup', registerUserValidator, registerUser);

module.exports = router;
