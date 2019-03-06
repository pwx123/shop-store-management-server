const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController')

// 获取公钥
router.post('/getPublicKey', indexController.getPublicKey);
// 获取用户信息
router.post('/getUserInfo', indexController.getUserInfo);

module.exports = router;