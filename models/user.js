const mongoose = require('mongoose');

const { EMAIL_REG } = require('../utils/constants');

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => EMAIL_REG.test(email),
        message: 'Некорректный email',
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
);

  module.exports = mongoose.model('user', userSchema);
