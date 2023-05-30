const jwt = require('jsonwebtoken');

const { NODE_ENV, SECRET_KEY } = require('../utils/constants');

function authorizeUser(req, _, next) {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';

  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new Error('Неправильные почта или пароль'));
  }

  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? SECRET_KEY : 'dev-secret-key');
  } catch (err) {
    return next(new Error('Неправильные почта или пароль'));
  }

  req.user = payload;

  return next();
}

module.exports = authorizeUser;
