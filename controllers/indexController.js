const logger = require('../config/log4j');
const rsaKey = require('./../config/rsa');
const resMsg = require('../utils/utils').resMsg;
const indexModel = require('../modules/indexModel');

class indexController {
  /**
   * 获取公钥
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * @memberof indexController
   */
  static async getPublicKey(req, res, next) {
    try {
      let publicKey = rsaKey.exportKey('public');
      res.json(resMsg(200, publicKey));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 获取用户信息 排除密码
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * @memberof indexController
   */
  static async getUserInfo(req, res, next) {
    try {
      let name = req.session.loginUser;
      let result = await indexModel.getUserInfo(name);
      res.json(resMsg(200, result));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }
}

module.exports = indexController;