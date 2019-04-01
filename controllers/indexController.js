const logger = require("../config/log4j");
const rsaKey = require("./../config/rsa");
const resMsg = require("../utils/utils").resMsg;
const hasEmpty = require("../utils/utils").hasEmpty;
const getRandom = require("../utils/utils").getRandom;
const indexModel = require("../modules/indexModel");
const shopOrderModel = require("../modules/shopOrderModel");
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
      if (hasEmpty(req.body.provinceId)) {
        res.json(resMsg(9001));
        return false;
      }
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
      if (hasEmpty(req.body.cityId)) {
        res.json(resMsg(9001));
        return false;
      }
      let result = await areaModel.getCountryByCity(req.body.cityId);
      res.json(resMsg(200, result));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 根据物流id获取物流信息
   * @param req
   * @param res
   * @param next
   * @returns {Promise<boolean>}
   */
  static async getDeliveryInfoById(req, res, next) {
    try {
      if (hasEmpty(req.body.id)) {
        res.json(resMsg(9001));
        return false;
      }
      let deliveryInfo = [
        {
          time: "2019-10-12 18:41:53",
          info: "仓库已接单"
        },
        {
          time: "2019-10-12 20:31:14",
          info: "快递已从烟台转运发出"
        },
        {
          time: "2019-10-13 12:32:54",
          info: "快件到达 上海市奉贤区南桥 公司,已揽收"
        },
        {
          time: "2019-10-13 20:27:36",
          info: "浦东转运中心公司 已打包"
        },
        {
          time: "2019-10-13 21:19:24",
          info: "浦东转运中心公司 已发出,下一站 上海转运中心"
        },
        {
          time: "2019-10-14 08:57:08",
          info: "亲，您的快递已送达，请及时取件，如有疑问请电联，亲，您的快递已送达，请及时取件，如有疑问请电联，亲，您的快递已送达，请及时取件，如有疑问请电联"
        },
        {
          time: "2019-10-14 12:32:54",
          info: "【烟台市】山东省烟台市派件员 正在为您派件"
        }
      ];
      let len = getRandom(2, deliveryInfo.length);
      let resObj = {
        infoArr: [],
        status: getRandom(0, 2)
      };
      for (let i = 0; i < len; i++) {
        resObj.infoArr.push(deliveryInfo[getRandom(0, len)]);
      }
      res.json(resMsg(200, resObj));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 获取订单信息
   * @param req
   * @param res
   * @param next
   * @returns {Promise<void>}
   */
  static async getOrderStatistics(req, res, next) {
    try {
      let promiseArr = [shopOrderModel.getTodayOrder(), shopOrderModel.getAllDealWithOrder(), shopOrderModel.getAllRefundOrder()];
      let resultArr = await Promise.all(promiseArr);
      res.json(resMsg(200, {
        todayOrderNum: resultArr[0][0].get("todayOrderNum"),
        dealWithOrderNum: resultArr[1][0].get("dealWithOrderNum"),
        refundOrderNum: resultArr[2][0].get("refundOrderNum"),
      }));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   *
   * @param req
   * @param res
   * @param next
   * @returns {Promise<boolean>}
   */
  static async getOrderStatisticsByType(req, res, next) {
    try {
      if (hasEmpty(req.body.type)) {
        res.json(resMsg(9001));
        return false;
      }
      if (req.body.type === 0) {
        let promiseArr = [shopOrderModel.getTodaySubOrder(), shopOrderModel.getWeekSubOrder(), shopOrderModel.getMonthSubOrder()];
        let resultArr = await Promise.all(promiseArr);
        res.json(resMsg(200, {
          today: resultArr[0][0].get("today"),
          week: resultArr[1][0].get("week"),
          month: resultArr[2][0].get("month"),
        }));
      } else {
        let promiseArr = [shopOrderModel.getTodayMoney(), shopOrderModel.getWeekMoney(), shopOrderModel.getMonthMoney()];
        let resultArr = await Promise.all(promiseArr);
        res.json(resMsg(200, {
          today: resultArr[0][0].get("today") && resultArr[0][0].get("today").toFixed(2),
          week: resultArr[1][0].get("week") && resultArr[1][0].get("week").toFixed(2),
          month: resultArr[2][0].get("month") && resultArr[2][0].get("month").toFixed(2),
        }));
      }
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 获取本月Top10信息
   * @param req
   * @param res
   * @param next
   * @returns {Promise<void>}
   */
  static async getTop10Info(req, res, next){
    try {
      let promiseArr = [shopOrderModel.getBookTop10(), shopOrderModel.getStockTop10(), shopOrderModel.getUserTop10()];
      let resultArr = await Promise.all(promiseArr);
      res.json(resMsg(200, {
        book: resultArr[0],
        stock: resultArr[1],
        user: resultArr[2],
      }));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 获取趋势变化信息
   * @param req
   * @param res
   * @param next
   * @returns {Promise<boolean>}
   */
  static async getTrendInfo(req, res, next) {
    try {
      if (hasEmpty(req.body.type)) {
        res.json(resMsg(9001));
        return false;
      }
      if (req.body.type === 0) {
        let result = await shopOrderModel.getTrendCountInfo();
        res.json(resMsg(200, result[0] || []));
      } else {
        let result = await shopOrderModel.getTrendMoneyInfo();
        res.json(resMsg(200, result[0] || []));
      }
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }
}

module.exports = indexController;