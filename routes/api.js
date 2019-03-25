const express = require("express");
const router = express.Router();
const apiController = require("../controllers/apiController");

// 获取新订单
router.post("/getOrder", apiController.getOrder);

module.exports = router;