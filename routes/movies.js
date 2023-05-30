const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { URL_REG } = require('../utils/constants');

const {
  createMovie,
  receiveMovies,
  deleteMovie,
} = require('../controllers/movies');

router.post('/', celebrate({
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
}), createMovie);

router.get('/', receiveMovies);

router.delete('/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = router;
