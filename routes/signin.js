const router = require('express').Router();

const { loginUserValidator } = require('../utils/validation');

const { loginUser } = require('../controllers/users');

router.post('/signin', loginUserValidator, loginUser);

module.exports = router;
