const router = require('express').Router();

const { setCurrentUserInfoValidator } = require('../utils/validation');

const { getCurrentUserInfo, setCurrentUserInfo } = require('../controllers/users');

router.get('/me', getCurrentUserInfo);

router.patch('/me', setCurrentUserInfoValidator, setCurrentUserInfo);

module.exports = router;
