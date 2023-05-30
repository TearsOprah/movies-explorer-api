const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { EMAIL_REG } = require('../utils/constants');

const { getCurrentUserInfo, setCurrentUserInfo } = require('../controllers/users');

router.get('/me', getCurrentUserInfo);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    email: Joi.string().pattern(EMAIL_REG),
    name: Joi.string().min(2).max(30),
  }),
}), setCurrentUserInfo);

module.exports = router;
