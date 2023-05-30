const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { PASSWORD_REG } = require('../utils/constants');

const { loginUser } = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(PASSWORD_REG),
  }),
}), loginUser);

module.exports = router;
