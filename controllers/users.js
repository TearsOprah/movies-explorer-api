const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { NODE_ENV, SECRET_KEY, PASSWORD_REG } = require('../utils/constants')

function getCurrentUserInfo(req, res, next) {
  const { _id } = req.user;

  User
    .findById(_id)
    .then((user) => {
      if (user) {
        return res.send(user);
      } else {
        throw new Error('Пользователь с таким id не найден');
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
      } else {
        throw new Error('Пользователь с таким id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new Error('Некорректный id пользователя'));
      }

      if (err.name === 'ValidationError') {
        return next(new Error('Переданы некорректные данные при обновлении данных профиля пользователя'));
      }

      return next(err);
    });
}

function loginUser(req, res, next) {
  const { email, password } = req.body;

  if (!PASSWORD_REG.test(password)) {
    throw new Error('Пароль должен состоять минимум из 8 символов, включать 1 букву латиницы, цифру и спецсимвол');
  }

  User
    .findUserByCredentials(email, password)
    .then(({ _id }) => {
      if (_id) {
        const token = jwt.sign(
          { _id },
          NODE_ENV === 'production' ? SECRET_KEY : 'dev-secret-key',
          { expiresIn: '7d' },
        );

        return res.send({ token });
      }

      throw new Error('Неправильные почта или пароль');
    })
    .catch(next);
}

function registerUser(req, res, next) {
  const { email, password, name } = req.body;

  if (!PASSWORD_REG.test(password)) {
    throw new Error('Пароль должен состоять минимум из 8 символов, включать 1 букву латиницы, цифру и спецсимвол');
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
        next(new Error('Пользователь с таким электронным адресом уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new Error('Переданы некорректные данные при регистрации пользователя'));
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
