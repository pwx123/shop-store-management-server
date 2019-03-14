const express = require('express');
const router = express.Router();
const shopUserController = require('../controllers/shopUserController')

// 获取用户信息
router.post('/getShopUserInfo', shopUserController.getShopUserInfo);

module.exports = router;