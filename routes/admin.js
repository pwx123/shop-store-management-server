const express = require("express");
const router = express.Router();
const adminUserController = require("../controllers/adminUserController");

// 登录
router.post("/login", adminUserController.login);
// 注册
router.post("/register", adminUserController.register);
// 退出登陆
router.post("/logout", adminUserController.logout);
// 更改昵称
router.post("/updateNickname", adminUserController.updateNickname);
// 更改密码
router.post("/updatePassword", adminUserController.updatePassword);
// 更改头像
router.post("/updateAvatar", adminUserController.updateAvatar);

module.exports = router;