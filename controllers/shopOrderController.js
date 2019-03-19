const logger = require("../config/log4j");
const resMsg = require("../utils/utils").resMsg;
const hasEmpty = require("../utils/utils").hasEmpty;
const shopOrderModel = require("../modules/shopOrderModel");

class shopOrderController {
  /**
   * 分页获取订单记录
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof shopOrderController
   */
  static async getOrderList(req, res, next) {
    try {
      if (hasEmpty(req.body.pageSize, req.body.pageNumber, req.body.startTime, req.body.endTime)) {
        res.json(resMsg(9001));
        return false;
      }
      let result = await shopOrderModel.getOrderList(req.body);
      res.json(resMsg(200, result));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }
}

module.exports = shopOrderController;