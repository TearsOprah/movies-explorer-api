const Movie = require('../models/movie');

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
    .then(() => res.status(201).send({ message: 'Фильм успешно сохранен в личном кабинете' }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new Error('Переданы некорректные данные при сохранении фильма в личном кабинете'));
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
      } else {
        throw new Error('Фильмы пользователя с указанным id не найдены');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Error('Некорректный id пользователя'));
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
        throw new Error('Данные фильма не найдены по указанному id');
      }

      const { owner: movieOwnerId } = movie;
      if (movieOwnerId.valueOf() !== userId) {
        throw new Error('Нет прав доступа для удаления фильма из личного кабинета другого пользователя');
      }

      movie
        .deleteOne()
        .then(() => res.send({ message: 'Фильм успешно удален из личного кабинета пользователя' }))
        .catch(next);
    })
    .catch(next);
}


module.exports = {
  createMovie,
  deleteMovie,
  getMovies,
};
