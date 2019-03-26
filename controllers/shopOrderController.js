const formidable = require("formidable");
const fs = require("fs");
const nodeXlsx = require("node-xlsx");
const logger = require("../config/log4j");
const resMsg = require("../utils/utils").resMsg;
const hasEmpty = require("../utils/utils").hasEmpty;
const numReg = require("../utils/utils").numReg;
const getRefundOrderId = require("../utils/utils").getRefundOrderId;
const shopOrderModel = require("../modules/shopOrderModel");
const uploadConfig = require("./../config/uploadConfig");

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

  /**
   * 根据订单号查询订单
   * @param req
   * @param res
   * @param next
   * @returns {Promise<void>}
   */
  static async getOrderByOrderId(req, res, next){
    try {
      if (hasEmpty(req.body.orderId)) {
        res.json(resMsg(9001));
        return false;
      }
      let result = await shopOrderModel.getOrderByOrderId(req.body.orderId);
      res.json(resMsg(200, result));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 确认待处理订单
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * @memberof shopOrderController
   */
  static async submitOrder(req, res, next) {
    try {
      if (hasEmpty(req.body.ids)) {
        res.json(resMsg(9001));
        return false;
      }
      let result = await shopOrderModel.submitOrder(req.body.ids);
      if (!result || result[0] === 0) {
        res.json(resMsg(2002));
      } else {
        res.json(resMsg(200));
      }
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 上传/编辑物流信息
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof shopOrderController
   */
  static async submitDeliveryInfo(req, res, next) {
    try {
      let {
        id,
        deliveryId,
        deliveryOrderId
      } = req.body;
      if (hasEmpty(id, deliveryId, deliveryOrderId) || !/^[A-Za-z0-9]+$/.test(deliveryOrderId) || !numReg.test(deliveryId)) {
        res.json(resMsg(9001));
        return false;
      }
      let params = {
        id,
        deliveryId,
        deliveryOrderId,
        deliveryAt: new Date()
      };
      let result = await shopOrderModel.getSubmitDeliveryInfo(params);
      if (!result || result.length === 0) {
        res.json(resMsg(2002));
      } else {
        await shopOrderModel.submitDeliveryInfo(params);
        res.json(resMsg(200));
      }
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 更改订单物流信息
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof shopOrderController
   */
  static async updateOrderAddress(req, res, next) {
    try {
      let {
        id,
        deliveryAddressId
      } = req.body;
      if (hasEmpty(id, deliveryAddressId)) {
        res.json(resMsg(9001));
        return false;
      }
      let params = {
        id,
        deliveryAddressId
      };
      let result = await shopOrderModel.getUpdateAddressInfo(params);
      if (!result || result.length === 0) {
        res.json(resMsg(2002));
      } else {
        await shopOrderModel.updateAddressInfo(params);
        res.json(resMsg(200));
      }
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 获取所有物流公司
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * @memberof shopOrderController
   */
  static async getAllDeliveryCompany(req, res, next) {
    try {
      let result = await shopOrderModel.getAllDeliveryCompany();
      res.json(resMsg(200, result));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 新增收货地址
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof shopOrderController
   */
  static async submitAddAddress(req, res, next) {
    try {
      let {
        userId,
        deliveryName,
        deliveryMobile,
        provinceId,
        cityId,
        countryId,
        detailAddress
      } = req.body;
      if (hasEmpty(userId, deliveryName, deliveryMobile, provinceId, cityId, countryId, detailAddress)) {
        res.json(resMsg(9001));
        return false;
      }
      await shopOrderModel.submitAddAddress({
        userId,
        deliveryName,
        deliveryMobile,
        provinceId,
        cityId,
        countryId,
        detailAddress
      });
      res.json(resMsg(200));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   *  处理退款订单
   * @param req
   * @param res
   * @param next
   */
  static async submitRefundInfo(req, res, next) {
    try {
      let {
        ids,
        refundRemark,
        refundStatus
      } = req.body;
      if (hasEmpty(ids, refundRemark, refundStatus) || (refundStatus !== 0 && refundStatus !== 1)) {
        res.json(resMsg(9001));
        return false;
      }
      let idsArr = ids.split(",");
      let result = await shopOrderModel.getUpdateRefundInfo(idsArr);
      if (!result || result.length !== idsArr.length) {
        res.json(resMsg(2002));
      } else {
        let status = refundStatus === 0 ? 8 : 7;
        await shopOrderModel.submitRefundInfo({
          idsArr,
          status
        });
        let refundRecordData = [];
        for (let i = 0, len = result.length; i < len; i++) {
          let obj = {
            remark: refundRemark,
            status
          };
          obj.refundOrderId = getRefundOrderId(result[i].userId);
          obj.orderNumId = result[i].orderId;
          obj.userName = result[i].userName;
          obj.refundMoney = status === 7 ? result[i].totalMoney : null;
          refundRecordData.push(obj);
        }
        await shopOrderModel.createRefundRecord(refundRecordData);
        res.json(resMsg(200));
      }
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   *  分页获取退款订单记录
   * @param req
   * @param res
   * @param next
   * @returns {Promise<boolean>}
   */
  static async getRefundRecord(req, res, next){
    try {
      if (hasEmpty(req.body.pageSize, req.body.pageNumber, req.body.startTime, req.body.endTime)) {
        res.json(resMsg(9001));
        return false;
      }
      let result = await shopOrderModel.getRefundRecord(req.body);
      res.json(resMsg(200, result));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 删除物流公司
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * @memberof shopOrderController
   */
  static async deleteDeliveryCompany(req, res, next) {
    try {
      if (hasEmpty(req.body.id)) {
        res.json(resMsg(9001));
        return false;
      }
      await shopOrderModel.deleteDeliveryCompany(req.body.id);
      res.json(resMsg(200));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 新增物流公司
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @returns
   * @memberof shopOrderController
   */
  static async addDeliveryCompany(req, res, next) {
    try {
      if (hasEmpty(req.body.deliveryCompanyName)) {
        res.json(resMsg(9001));
        return false;
      }
      await shopOrderModel.addDeliveryCompany([{
        name: req.body.deliveryCompanyName
      }]);
      res.json(resMsg(200));
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }

  /**
   * 批量上传物流公司
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof shopOrderController
   */
  static async uploadDeliveryExcel(req, res, next) {
    let excelUrl = uploadConfig.TEMP;
    let form = new formidable.IncomingForm();
    let map = {
      1: "A"
    };
    let dataMap = {
      0: "name"
    };
    const DATA_LENGTH = Object.keys(dataMap).length;
    form.encoding = uploadConfig.ENCODING;
    form.uploadDir = uploadConfig.SERVER_DIR + excelUrl;
    form.keepExtensions = uploadConfig.KEEP_EXTENSIONS;
    form.maxFileSize = uploadConfig.MAX_FILESIZE;
    let errorMsg = "";
    form.parse(req, async (error, fields, files) => {
      if (error) {
        logger.error(error);
        res.json(resMsg());
        return false;
      }
      // 读取文件
      const excelData = nodeXlsx.parse(files.excel.path);
      // 删除文件
      fs.unlink(files.excel.path, (error) => {
        if (error) {
          logger.error(error);
        }
      });
      let optionData = excelData[0].data;
      let saveData = [];
      if (optionData.length > 1) {
        for (let i = 1, len = optionData.length; i < len; i++) {
          let data = optionData[i];
          let saveDataObj = {};
          for (let j = 0; j < DATA_LENGTH; j++) {
            let val = data[j];
            if (hasEmpty(val)) {
              errorMsg = `第 <span style="color:#f56c6c">${i + 1}</span> 行第 <span style="color:#f56c6c">${map[j + 1]}</span> 列数据不能为空`;
              break;
            }
            saveDataObj[dataMap[j]] = val;
          }
          if (errorMsg) {
            break;
          }
          saveData.push(saveDataObj);
        }
        if (errorMsg) {
          logger.error(errorMsg);
          res.json({
            errorCode: 9999,
            errorMsg: errorMsg,
            data: ""
          });
          return false;
        } else {
          await shopOrderModel.addDeliveryCompany(saveData);
          res.json(resMsg(200));
        }
      } else {
        logger.error("上传文件内容为空");
        res.json(resMsg(2001));
        return false;
      }
    });
    form.on("error", function (error) {
      logger.error(error);
      res.json(resMsg());
      return false;
    });
  }

  /**
   * 下载物流上传模板
   *
   * @static
   * @param {*} req
   * @param {*} res
   * @param {*} next
   * @memberof shopOrderController
   */
  static async downloadDeliveryTemplate(req, res, next) {
    try {
      let filePath = uploadConfig.SERVER_DIR + uploadConfig.DELIVERY_TEMPLATE + "/" + uploadConfig.DELIVERY_COMPONY_EXCEL;
      res.download(filePath);
    } catch (error) {
      logger.error(error);
      res.json(resMsg());
    }
  }
}

module.exports = shopOrderController;