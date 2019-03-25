const logger = require("../config/log4j");
const resMsg = require("../utils/utils").resMsg;
const hasEmpty = require("../utils/utils").hasEmpty;
const shopModel = require("../modules/shopModel");
const adminUserModel = require("../modules/adminUserModel");

class shopController {
  /**
   * 获取店铺信息
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof shopController
   */
  static async getShopInfo(req, res, next) {
    try {
      let result = await shopModel.getUserInfo();
      res.json(resMsg(200, result));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 更新店铺名
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof shopController
   */
  static async updateShopName(req, res, next) {
    try {
      let shopName = req.body.shopName;
      let remark = req.body.remark;
      if (hasEmpty(shopName, remark)) {
        res.json(resMsg(9001));
        return false;
      }
      let result = await adminUserModel.getUserInfo(req.session.loginUser);
      let {
        name,
        nickname
      } = result;
      await shopModel.update({
        shopName
      });
      await shopModel.createOptionRecord({
        optionName: name,
        optionNickname: nickname,
        type: 0,
        remark
      });
      res.json(resMsg(200));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 更改店铺状态
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof shopController
   */
  static async changeShopStatus(req, res, next) {
    try {
      let status = req.body.status;
      let remark = req.body.remark;
      if (hasEmpty(status, remark)) {
        res.json(resMsg(9001));
        return false;
      }
      let result = await adminUserModel.getUserInfo(req.session.loginUser);
      let {
        name,
        nickname
      } = result;
      await shopModel.update({
        status
      });
      await shopModel.createOptionRecord({
        optionName: name,
        optionNickname: nickname,
        type: 1,
        remark
      });
      res.json(resMsg(200));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 更改店铺描述
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof shopController
   */
  static async updateShopDescription(req, res, next) {
    try {
      let description = req.body.description;
      let remark = req.body.remark;
      if (hasEmpty(description, remark)) {
        res.json(resMsg(9001));
        return false;
      }
      let result = await adminUserModel.getUserInfo(req.session.loginUser);
      let {
        name,
        nickname
      } = result;
      await shopModel.update({
        description
      });
      await shopModel.createOptionRecord({
        optionName: name,
        optionNickname: nickname,
        type: 2,
        remark
      });
      res.json(resMsg(200));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 分页查询店铺操作日志
   *
   * @static
   * @memberof shopController
   */
  static async getOptionRecord(req, res, next) {
    try {
      if (hasEmpty(req.body.pageSize, req.body.pageNumber, req.body.startTime, req.body.endTime)) {
        res.json(resMsg(9001));
        return false;
      }
      let result = await shopModel.getOptionRecord(req.body);
      res.json(resMsg(200, result));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }
}

module.exports = shopController;