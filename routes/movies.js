const router = require('express').Router();

const { createMovieValidator, deleteMovieValidator } = require('../utils/validation');

const {
  createMovie,
  getMovies,
  deleteMovie,
} = require('../controllers/movies');

router.post('/', createMovieValidator, createMovie);

router.get('/', getMovies);

router.delete('/:id', deleteMovieValidator, deleteMovie);

module.exports = router;
