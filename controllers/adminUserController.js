const rsaKey = require('../config/rsa');
const logger = require('../config/log4j');
const resMsg = require('../utils/utils').resMsg;
const hasEmpty = require('../utils/utils').hasEmpty;
const mobileReg = require('../utils/utils').mobileReg;
const pwdReg = require('../utils/utils').pwdReg;
const adminUserModel = require('../modules/adminUserModel');

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
      let decryptPwd = rsaKey.decrypt(pwd, 'utf8');
      if (hasEmpty(name, decryptPwd)) {
        res.json(resMsg(9001));
        return false;
      } else {
        let result = await adminUserModel.getUserInfo(name);
        if (result === null) {
          res.json(resMsg(1001));
          return false;
        }
        if (decryptPwd === result.pwd) {
          req.session.loginUser = result.name;
          res.json(resMsg(200));
        } else {
          res.json(resMsg(1002));
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
      let pwd = decodeURI(req.body.pwd);
      let repPwd = decodeURI(req.body.repPwd)
      let decryptPwd = rsaKey.decrypt(pwd, 'utf8');
      let decryptRepPwd = rsaKey.decrypt(repPwd, 'utf8');
      if (hasEmpty(name, decryptPwd, decryptRepPwd) && !mobileReg.test(name) && !pwdReg.test(pwd)) {
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
  static async logout(req, res, next) {
    req.session.destroy();
    res.json(resMsg(200));
  }
}

module.exports = adminUserController;