const express = require('express');
const mongoose = require('mongoose');

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost:27017/bitfilmsdb')
  .then(() => {
    console.log('Соединение с MongoDB установлено');
  })
  .catch((err) => console.log(`Ошибка при соединении с MongoDB: ${err}`));

const app = express();

const { PORT = 3000 } = process.env;

app.listen(PORT, (err) => {
  return err
    ? console.log(`Ошибка в процессе соединения с портом: ${err}`)
    : console.log(`Соединение с портом ${PORT} установлено`);
});
