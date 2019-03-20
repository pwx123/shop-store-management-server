const express = require('express');
const router = express.Router();
const shopOrderController = require('../controllers/shopOrderController')

// 分页查询订单列表
router.post('/getOrderList', shopOrderController.getOrderList);
// 确认待处理订单
router.post('/submitOrder', shopOrderController.submitOrder);
// 上传/编辑物流信息
router.post('/submitDeliveryInfo', shopOrderController.submitDeliveryInfo);
// 查询所有物流公司
router.post('/getAllDeliveryCompany', shopOrderController.getAllDeliveryCompany);
// 添加物流公司
router.post('/addDeliveryCompany', shopOrderController.addDeliveryCompany);
// 删除物流公司
router.post('/deleteDeliveryCompany', shopOrderController.deleteDeliveryCompany);
// 批量上传物流公司
router.post('/uploadDeliveryExcel', shopOrderController.uploadDeliveryExcel);
// 下载物流上传模板
router.post('/downloadDeliveryTemplate', shopOrderController.downloadDeliveryTemplate);

module.exports = router;