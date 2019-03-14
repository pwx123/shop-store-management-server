const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController')

// 获取公钥
router.post('/getPublicKey', indexController.getPublicKey);
// 获取用户信息
router.post('/getUserInfo', indexController.getUserInfo);
// 获取省份
router.post('/getProvince', indexController.getProvince);
// 根据省份获取市
router.post('/getCityByProvince', indexController.getCityByProvince);
// 根据市获取县
router.post('/getCountryByCity', indexController.getCountryByCity);

module.exports = router;