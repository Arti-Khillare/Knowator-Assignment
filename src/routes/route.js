const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.post('/useradd', userController.createUser);
router.post('/userlogin', userController.loginUser);

module.exports = router