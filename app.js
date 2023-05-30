const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');

const router = require('./routes/index');

const { PORT = 3000 } = process.env;

const app = express();

app.use(cors());
app.use(helmet());

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.use(express.json());

app.use(router);

app.use(errors());

app.listen(PORT, (err) => {
  return err
    ? console.log(`Ошибка в процессе соединения с портом: ${err}`)
    : console.log(`Соединение с портом ${PORT} установлено`);
});
