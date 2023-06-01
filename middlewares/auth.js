const jwt = require('jsonwebtoken');

const { nodeEnv, secretKey } = require('../config');

const UnauthorizedError = require('../errors/UnauthorizedError');
const { errorMessages } = require('../utils/constants');

function authorizeUser(req, _, next) {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';

  if (!authorization || !authorization.startsWith(bearer)) {
    return next(new UnauthorizedError(errorMessages.invalidCredentials));
  }

  const token = authorization.replace(bearer, '');
  let payload;

  try {
    payload = jwt.verify(token, nodeEnv === 'production' ? secretKey : 'dev-secret-key');
  } catch (err) {
    return next(new UnauthorizedError(errorMessages.invalidCredentials));
  }

  req.user = payload;

  return next();
}

module.exports = authorizeUser;
