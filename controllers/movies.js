const Movie = require('../models/movie');

const InaccurateDataError = require('../errors/InaccurateDataError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const { successMessages, errorMessages, STATUS_CREATED } = require('../utils/constants');

function createMovie(req, res, next) {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  const { _id } = req.user;

  Movie
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner: _id,
      movieId,
      nameRU,
      nameEN,
    })
    .then(() => res.status(STATUS_CREATED).send({ message: successMessages.movieCreated }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new InaccurateDataError(errorMessages.inaccurateData));
      } else {
        next(err);
      }
    });
}

function getMovies(req, res, next) {
  const { _id } = req.user;

  Movie
    .find({ owner: _id })
    .populate('owner', '_id')
    .then((movies) => {
      if (movies.length > 0) {
        return res.send(movies);
      }
      throw new NotFoundError(errorMessages.movieNotFound);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InaccurateDataError(errorMessages.userNotFound));
      } else {
        next(err);
      }
    });
}

function deleteMovie(req, res, next) {
  const { id: movieId } = req.params;
  const { _id: userId } = req.user;

  Movie
    .findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(errorMessages.movieNotFound);
      }

      const { owner: movieOwnerId } = movie;
      if (movieOwnerId.valueOf() !== userId) {
        throw new ForbiddenError(errorMessages.accessDenied);
      }

      movie
        .deleteOne()
        .then(() => res.send({ message: successMessages.movieDeleted }))
        .catch(next);
    })
    .catch(next);
}

module.exports = {
  createMovie,
  deleteMovie,
  getMovies,
};
