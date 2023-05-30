const router = require('express').Router();

const NotFoundError = require('../errors/NotFoundError');
const { errorMessages } = require('../utils/constants');

const routeSignup = require('./signup');
const routeSignin = require('./signin');

const auth = require('../middlewares/auth');

const routeUsers = require('./users');
const routeMovies = require('./movies');

router.use('/', routeSignup);
router.use('/', routeSignin);

router.use(auth);

router.use('/users', routeUsers);
router.use('/movies', routeMovies);

router.use((req, res, next) => next(new NotFoundError(errorMessages.pageNotFound)));

module.exports = router;
