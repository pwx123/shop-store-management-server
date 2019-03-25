const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");

// 获取店铺信息
router.post("/getShopInfo", shopController.getShopInfo);
// 更改店铺名
router.post("/updateShopName", shopController.updateShopName);
// 更改店铺状态
router.post("/changeShopStatus", shopController.changeShopStatus);
// 更新店铺描述
router.post("/updateShopDescription", shopController.updateShopDescription);
// 分页查询店铺操作日志
router.post("/getOptionRecord", shopController.getOptionRecord);

module.exports = router;