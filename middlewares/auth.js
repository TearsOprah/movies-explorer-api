const jwt = require('jsonwebtoken');

const { nodeEnv, secretKey } = require('../config');

function authorizeUser(req, _, next) {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';

  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new Error('Неправильные почта или пароль'));
  }

  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(token, nodeEnv === 'production' ? secretKey : 'dev-secret-key');
  } catch (err) {
    return next(new Error('Неправильные почта или пароль'));
  }

  req.user = payload;

  return next();
}

module.exports = authorizeUser;
