const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const rsaKey = require("../config/rsa");
const logger = require("../config/log4j");
const resMsg = require("../utils/utils").resMsg;
const hasEmpty = require("../utils/utils").hasEmpty;
const mobileReg = require("../utils/utils").mobileReg;
const uploadConfig = require("./../config/uploadConfig");
const adminUserModel = require("../modules/adminUserModel");

class adminUserController {
  /**
   * 管理员登录
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * @memberof adminUserController
   */
  static async login(req, res, next) {
    try {
      let name = req.body.name;
      let pwd = decodeURI(req.body.pwd);
      let decryptPwd = rsaKey.decrypt(pwd, "utf8"); // 私钥解密密码
      if (hasEmpty(name, decryptPwd)) {
        res.json(resMsg(9001));
        return false;
      } else {
        let result = await adminUserModel.getUserInfo(name); // 更加用户名获取用户信息
        if (result === null) {
          res.json(resMsg(1001)); // 无此用户
          return false;
        }
        if (decryptPwd === result.pwd) { // 判断密码是否正确
          req.session.loginUser = result.name; // 登录成功后设置成功标识
          req.session.loginId = result.id;
          res.json(resMsg(200));
        } else {
          res.json(resMsg(1002)); // 密码错误
        }
      }
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 管理员注册
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * @memberof adminUserController
   */
  static async register(req, res, next) {
    try {
      let name = req.body.name;
      let nickname = req.body.nickname;
      let pwd = decodeURI(req.body.pwd);
      let repPwd = decodeURI(req.body.repPwd);
      let decryptPwd = rsaKey.decrypt(pwd, "utf8");
      let decryptRepPwd = rsaKey.decrypt(repPwd, "utf8");
      if (hasEmpty(name, decryptPwd, decryptRepPwd, nickname) || !mobileReg.test(name) || nickname.length > 20) {
        res.json(resMsg(9001));
        return false;
      } else {
        if (decryptRepPwd !== decryptPwd) {
          res.json(resMsg(1004));
          return false;
        }
        let result = await adminUserModel.getUserInfo(name);
        if (result !== null) {
          res.json(resMsg(1003));
          return false;
        }
        await adminUserModel.create({
          nickname: nickname,
          name: name,
          pwd: decryptPwd
        });
        res.json(resMsg(200));
      }
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 退出登录
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof adminUserController
   */
  static async logout(req, res, next) {
    req.session.destroy();
    res.json(resMsg(200));
  }

  /**
   * 更新昵称
   *
   * @static
   * @param {*} res
   * @param {*} res
   * @param {*} next
   * @memberof adminUserController
   */
  static async updateNickname(req, res, next) {
    try {
      let {
        nickname
      } = req.body;
      if (hasEmpty(nickname) || nickname.length > 20) {
        nickname = "";
      }
      await adminUserModel.update({
        nickname
      }, req.session.loginUser);
      res.json(resMsg(200));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 更改密码
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof adminUserController
   */
  static async updatePassword(req, res, next) {
    try {
      let pwd = decodeURI(req.body.pwd);
      let newPwd = decodeURI(req.body.newPwd);
      let repNewPwd = decodeURI(req.body.repNewPwd);
      let decryptPwd = rsaKey.decrypt(pwd, "utf8");
      let decryptNewPwd = rsaKey.decrypt(newPwd, "utf8");
      let decryptRepNewPwd = rsaKey.decrypt(repNewPwd, "utf8");
      if (hasEmpty(decryptPwd, decryptNewPwd, decryptRepNewPwd)) {
        res.json(resMsg(9001));
        return false;
      }
      if (decryptNewPwd !== decryptRepNewPwd) {
        res.json(resMsg(1004));
        return false;
      }
      let result = await adminUserModel.getUserInfo(req.session.loginUser);
      if (result.pwd === decryptPwd) {
        await adminUserModel.update({
          pwd: decryptNewPwd
        }, req.session.loginUser);
        req.session.destroy();
        res.json(resMsg(200));
      } else {
        logger.error("原密码错误");
        res.json(resMsg(1005));
      }
    } catch (error) {
      logger.error(error);
    }
  }

  /**
   * 更新头像
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof adminUserController
   */
  static async updateAvatar(req, res, next) {
    let form = new formidable.IncomingForm();
    form.encoding = uploadConfig.ENCODING;
    form.uploadDir = uploadConfig.SERVER_DIR + uploadConfig.ADMIN_AVATAR_URL;
    form.keepExtensions = uploadConfig.KEEP_EXTENSIONS;
    form.maxFileSize = uploadConfig.MAX_FILESIZE;
    form.parse(req, async (error, fields, files) => {
      if (error) {
        logger.error(error);
        res.json(resMsg());
        return false;
      }
      let avatarUrl = "";
      if (files.avatar) {
        let extname = path.extname(files.avatar.name);
        let newPath = uploadConfig.SERVER_DIR + uploadConfig.ADMIN_AVATAR_URL + req.session.loginUser + extname.toLocaleLowerCase();
        fs.renameSync(files.avatar.path, newPath);
        avatarUrl = uploadConfig.SERVER_URL + uploadConfig.ADMIN_AVATAR_URL + req.session.loginUser + extname.toLocaleLowerCase();
      } else {
        res.json(resMsg(9001));
        return false;
      }
      await adminUserModel.update({
        avatarUrl
      }, req.session.loginUser);
      res.json(resMsg(200));
    });
    form.on("error", function (error) {
      logger.error(error);
      res.json(resMsg());
      return false;
    });
  }
}

module.exports = adminUserController;
