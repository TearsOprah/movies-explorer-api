const rateLimiter = require('express-rate-limit');

const limiter = rateLimiter({
  windowMs: 10000,
  max: 100,
  message: 'Превышено количество запросов на сервер. Повторите попытку позже',
});

module.exports = limiter;
