const { celebrate, Joi } = require('celebrate');

const EMAIL_REG = /.+@.+\..+/;
const URL_REG = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
const PASSWORD_REG = /^(?=.*[A-z])(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/;

const createMovieValidator = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(URL_REG),
    trailerLink: Joi.string().required().pattern(URL_REG),
    thumbnail: Joi.string().required().pattern(URL_REG),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

const deleteMovieValidator = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
});

const loginUserValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(PASSWORD_REG),
  }),
});

const registerUserValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().pattern(PASSWORD_REG),
    name: Joi.string().required().min(2).max(30),
  }),
});

const setCurrentUserInfoValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().pattern(EMAIL_REG),
    name: Joi.string().min(2).max(30),
  }),
});

module.exports = {
  EMAIL_REG,
  URL_REG,
  PASSWORD_REG,

  createMovieValidator,
  deleteMovieValidator,
  loginUserValidator,
  registerUserValidator,
  setCurrentUserInfoValidator,
};
