const logger = require("../config/log4j");
const resMsg = require("../utils/utils").resMsg;
const hasEmpty = require("../utils/utils").hasEmpty;
const shopUserModel = require("../modules/shopUserModel");

class shopUserController {
  /**
   * 获取店铺用户信息
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof shopUserController
   */
  static async getShopUserInfo(req, res, next) {
    try {
      if (hasEmpty(req.body.pageSize, req.body.pageNumber, req.body.startTime, req.body.endTime)) {
        res.json(resMsg(9001));
        return false;
      }
      let result = await shopUserModel.getShopUserInfo(req.body);
      res.json(resMsg(200, result));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }
}

module.exports = shopUserController;