const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const { PASSWORD_REG } = require('../utils/validation');
const { nodeEnv, secretKey } = require('../config');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const InaccurateDataError = require('../errors/InaccurateDataError');
const { successMessages, errorMessages, STATUS_CREATED } = require('../utils/constants');

function getCurrentUserInfo(req, res, next) {
  const { _id } = req.user;

  User
    .findById(_id)
    .then((user) => {
      if (user) {
        return res.send(user);
      }
      throw new NotFoundError(errorMessages.userNotFound);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new InaccurateDataError(errorMessages.invalidId));
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
      throw new NotFoundError(errorMessages.userNotFound);
    })
    .catch((err) => {
      // if (err.name === 'CastError') {
      //   return next(new InaccurateDataError(errorMessages.invalidId));
      // }

      if (err.name === 'ValidationError') {
        return next(new InaccurateDataError(errorMessages.updateFailed));
      }

      return next(err);
    });
}

function loginUser(req, res, next) {
  const { email, password } = req.body;

  if (!PASSWORD_REG.test(password)) {
    return next(new InaccurateDataError('Пароль должен состоять минимум из 8 символов, включать 1 букву латиницы, цифру и спецсимвол'));
  }

  return User
    .findUserByCredentials(email, password)
    .then(({ _id }) => {
      const token = jwt.sign(
        { _id },
        nodeEnv === 'production' ? secretKey : 'dev-secret-key',
        { expiresIn: '7d' },
      );

      return res.send({ token });
    })
    .catch(next);
}

function registerUser(req, res, next) {
  const { email, password, name } = req.body;

  if (!PASSWORD_REG.test(password)) {
    return next(new InaccurateDataError('Пароль должен состоять минимум из 8 символов, включать 1 букву латиницы, цифру и спецсимвол'));
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then(() => res.status(STATUS_CREATED).send({ message: successMessages.userRegistered }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(errorMessages.duplicateEmail));
      } else if (err.name === 'ValidationError') {
        next(new InaccurateDataError(errorMessages.inaccurateData));
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
