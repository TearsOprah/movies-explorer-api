const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const { URL_REG } = require('../utils/validation');

const movieSchema = new Schema(
  {
    country: {
      type: String,
      required: true,
    },

    director: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    year: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
      validate: {
        validator: (url) => URL_REG.test(url),
        message: 'Требуется ввести URL',
      },
    },

    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator: (url) => URL_REG.test(url),
        message: 'Требуется ввести URL',
      },
    },

    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: (url) => URL_REG.test(url),
        message: 'Требуется ввести URL',
      },
    },

    owner: {
      type: ObjectId,
      ref: 'user',
      required: true,
    },

    movieId: {
      type: Number,
      required: true,
    },

    nameRU: {
      type: String,
      required: true,
    },

    nameEN: {
      type: String,
      required: true,
    },
  },
);

module.exports = mongoose.model('movie', movieSchema);
