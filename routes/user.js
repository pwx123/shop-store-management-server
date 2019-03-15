const express = require('express');
const router = express.Router();
const shopUserController = require('../controllers/shopUserController')

// 获取用户信息
router.post('/getShopUserInfo', shopUserController.getShopUserInfo);
// 获取用户收货地址
router.post('/getUserDeliveryAddress', shopUserController.getUserDeliveryAddress);

module.exports = router;