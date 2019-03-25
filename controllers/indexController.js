const logger = require("../config/log4j");
const rsaKey = require("./../config/rsa");
const resMsg = require("../utils/utils").resMsg;
const indexModel = require("../modules/indexModel");
const areaModel = require("../modules/areaModel");

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
      let publicKey = rsaKey.exportKey("public");
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

  /**
   * 获取省份
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof indexController
   */
  static async getProvince(req, res, next) {
    try {
      let result = await areaModel.getProvince();
      res.json(resMsg(200, result));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 根据省份获取市
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof indexController
   */
  static async getCityByProvince(req, res, next) {
    try {
      let result = await areaModel.getCityByProvince(req.body.provinceId);
      res.json(resMsg(200, result));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 根据市获取县
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof indexController
   */
  static async getCountryByCity(req, res, next) {
    try {
      let result = await areaModel.getCountryByCity(req.body.cityId);
      res.json(resMsg(200, result));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }
}

module.exports = indexController;