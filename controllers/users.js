const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { PASSWORD_REG } = require('../utils/constants');
const { nodeEnv, secretKey } = require('../config');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const InaccurateDataError = require('../errors/InaccurateDataError');

function getCurrentUserInfo(req, res, next) {
  const { _id } = req.user;

  User
    .findById(_id)
    .then((user) => {
      if (user) {
        return res.send(user);
      }
      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InaccurateDataError('Некорректный id пользователя'));
      } else {
        next(err);
      }
    });
}

function setCurrentUserInfo(req, res, next) {
  const { email, name } = req.body;
  const { _id } = req.user;

  User
    .findByIdAndUpdate(
      _id,
      {
        email,
        name,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => {
      if (user) {
        return res.send(user);
      }
      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new InaccurateDataError('Некорректный id пользователя'));
      }

      if (err.name === 'ValidationError') {
        return next(new InaccurateDataError('Переданы некорректные данные при обновлении данных профиля пользователя'));
      }

      return next(err);
    });
}

function loginUser(req, res, next) {
  const { email, password } = req.body;

  if (!PASSWORD_REG.test(password)) {
    throw new InaccurateDataError('Пароль должен состоять минимум из 8 символов, включать 1 букву латиницы, цифру и спецсимвол');
  }

  User
    .findUserByCredentials(email, password)
    .then(({ _id }) => {
      if (_id) {
        const token = jwt.sign(
          { _id },
          nodeEnv === 'production' ? secretKey : 'dev-secret-key',
          { expiresIn: '7d' },
        );

        return res.send({ token });
      }

      throw new UnauthorizedError('Неправильные почта или пароль');
    })
    .catch(next);
}

function registerUser(req, res, next) {
  const { email, password, name } = req.body;

  if (!PASSWORD_REG.test(password)) {
    throw new InaccurateDataError('Пароль должен состоять минимум из 8 символов, включать 1 букву латиницы, цифру и спецсимвол');
  }

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then(() => res.status(201).send({ message: 'Пользователь успешно зарегистрирован на сайте' }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким электронным адресом уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new InaccurateDataError('Переданы некорректные данные при регистрации пользователя'));
      } else {
        next(err);
      }
    });
}

module.exports = {
  getCurrentUserInfo,
  setCurrentUserInfo,
  registerUser,
  loginUser,
};
