const express = require("express");
const router = express.Router();
const shopOrderController = require("../controllers/shopOrderController");

// 分页查询订单列表
router.post("/getOrderList", shopOrderController.getOrderList);
// 根据订单号查询订单
router.post("/getOrderByOrderId", shopOrderController.getOrderByOrderId);
// 确认待处理订单
router.post("/submitOrder", shopOrderController.submitOrder);
// 上传/编辑物流信息
router.post("/submitDeliveryInfo", shopOrderController.submitDeliveryInfo);
// 更改收货地址
router.post("/updateOrderAddress", shopOrderController.updateOrderAddress);
// 新增收货地址
router.post("/submitAddAddress", shopOrderController.submitAddAddress);
// 退款订单处理
router.post("/submitRefundInfo", shopOrderController.submitRefundInfo);
// 分页获取退款订单记录
router.post("/getRefundRecord", shopOrderController.getRefundRecord);
// 查询所有物流公司
router.post("/getAllDeliveryCompany", shopOrderController.getAllDeliveryCompany);
// 添加物流公司
router.post("/addDeliveryCompany", shopOrderController.addDeliveryCompany);
// 删除物流公司
router.post("/deleteDeliveryCompany", shopOrderController.deleteDeliveryCompany);
// 批量上传物流公司
router.post("/uploadDeliveryExcel", shopOrderController.uploadDeliveryExcel);
// 下载物流上传模板
router.post("/downloadDeliveryTemplate", shopOrderController.downloadDeliveryTemplate);

module.exports = router;