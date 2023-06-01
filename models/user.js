const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const { EMAIL_REG } = require('../utils/validation');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { errorMessages } = require('../utils/constants');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => EMAIL_REG.test(email),
        message: 'Требуется ввести email',
      },
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 30,
    },
  },

  {
    statics: {
      findUserByCredentials(email, password) {
        return (
          this
            .findOne({ email })
            .select('+password')
        )
          .then((user) => {
            if (user) {
              return bcrypt.compare(password, user.password)
                .then((matched) => {
                  if (matched) return user;

                  throw new UnauthorizedError(errorMessages.invalidCredentials);
                });
            }

            throw new UnauthorizedError(errorMessages.invalidCredentials);
          });
      },
    },
  },
);

module.exports = mongoose.model('user', userSchema);
