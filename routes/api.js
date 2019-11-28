const express = require("express");
const router = express.Router();
const apiController = require("../controllers/apiController");

// 自动生成订单
router.post("/getOrder", apiController.getOrder);
// 订单通知
router.post("/orderNotify", apiController.orderNotify);

module.exports = router;
