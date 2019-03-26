const db = require("../config/dbConnect");
const sequelize = db.sequelize;
const Op = sequelize.Op;
const shopOrderListSchema = sequelize.import("../schema/shopOrderListSchema");
const shopSubOrderListSchema = sequelize.import("../schema/shopSubOrderListSchema");
const shopDeliveryCompanySchema = sequelize.import("../schema/shopDeliveryCompanySchema");
const shopUserDeliveryAddressSchema = sequelize.import("../schema/shopUserDeliveryAddressSchema");
const shopRefundRecordSchema = sequelize.import("../schema/shopRefundRecordSchema");
const hasEmpty = require("../utils/utils").hasEmpty;
const getUncertainSqlObj = require("./../utils/utils").getUncertainSqlObj;

class shopOrderModel {
  /**
   * 分页查询订单列表
   *
   * @static
   * @memberof shopOrderModel
   */
  static async getOrderList(parmas) {
    let {
      pageSize,
      pageNumber,
      startTime,
      endTime,
      status,
      orderId,
      userName
    } = parmas;
    let searchObj = getUncertainSqlObj({
      status,
      orderId,
      userName
    });
    shopOrderListSchema.hasMany(shopSubOrderListSchema, {
      foreignKey: "mainOrderId",
      sourceKey: "id",
      as: {
        singular: "orders",
        plural: "orders"
      }
    });
    let result = await shopOrderListSchema.findAndCountAll({
      offset: pageSize * (pageNumber - 1),
      limit: pageSize,
      where: {
        createdAt: {
          [Op.gt]: startTime,
          [Op.lt]: endTime,
        },
        ...searchObj
      },
      include: [{
        model: shopSubOrderListSchema,
        as: "orders"
      }],
      order: [
        ["id", "DESC"]
      ],
      distinct: true
    });
    return {
      pageSize,
      pageNumber,
      rows: result.rows,
      total: result.count
    };
  }

  /**
   * 根据订单号查询订单
   * @param orderId
   * @returns {Promise<*>}
   */
  static async getOrderByOrderId(orderId) {
    shopOrderListSchema.hasMany(shopSubOrderListSchema, {
      foreignKey: "mainOrderId",
      sourceKey: "id",
      as: {
        singular: "orders",
        plural: "orders"
      }
    });
    return await shopOrderListSchema.findOne({
      where: {
        orderId
      },
      include: [{
        model: shopSubOrderListSchema,
        as: "orders"
      }],
      distinct: true
    });
  }

  /**
   * 确认待处理订单
   *
   * @static
   * @param {string} ids 逗号间隔订单id
   * @returns
   * @memberof shopOrderModel
   */
  static async submitOrder(ids) {
    return await shopOrderListSchema.update({
      status: 2
    }, {
      where: {
        status: 1,
        id: {
          [Op.in]: ids.split(",")
        }
      }
    });
  }

  /**
   * 查询符合更新条件的
   *
   * @static
   * @param {*} parmas
   * @memberof shopOrderModel
   */
  static async getSubmitDeliveryInfo(parmas) {
    let {
      id
    } = parmas;
    return await shopOrderListSchema.findAll({
      where: {
        status: {
          [Op.or]: [2, 3]
        },
        id
      }
    });
  }

  /**
   * 查询符合收货地址符合条件的
   *
   * @static
   * @param {*} parmas
   * @memberof shopOrderModel
   */
  static async getUpdateAddressInfo(parmas) {
    let {
      id
    } = parmas;
    return await shopOrderListSchema.findAll({
      where: {
        status: {
          [Op.or]: [1, 2, 3]
        },
        id
      }
    });
  }

  /**
   * 查询符合退款条件的
   *
   * @static
   * @param ids 退款的ids
   * @memberof shopOrderModel
   */
  static async getUpdateRefundInfo(idsArr) {
    return await shopOrderListSchema.findAll({
      where: {
        status: 6,
        id: {
          [Op.in]: idsArr
        }
      }
    });
  }

  /**
   * 更新待退款状态
   *
   * @static
   * @param param
   * @memberof shopOrderModel
   */
  static async submitRefundInfo(param) {
    return await shopOrderListSchema.update({
      status: param.status,
      dealAt: new Date()
    }, {
      where: {
        status: 6,
        id: {
          [Op.in]: param.idsArr
        }
      }
    });
  }

  /**
   * 生成退款订单记录
   * @param refundArr 退款订单数据
   * @returns {Promise<*>}
   */
  static async createRefundRecord(refundArr) {
    return await shopRefundRecordSchema.bulkCreate(refundArr);
  }

  /**
   * 分页获取退款订单记录
   * @param params
   * @returns {Promise<{total: *, pageNumber: *, pageSize: *, rows: *}>}
   */
  static async getRefundRecord(params) {
    let {
      pageSize,
      pageNumber,
      startTime,
      endTime,
      refundOrderId,
      orderNumId,
      userName,
      status
    } = params;
    let queryObj = getUncertainSqlObj({
      refundOrderId,
      orderNumId,
      userName,
      status
    });
    let result = await shopRefundRecordSchema.findAndCountAll({
      offset: pageSize * (pageNumber - 1),
      limit: pageSize,
      where: {
        createdAt: {
          [Op.gt]: startTime,
          [Op.lt]: endTime,
        },
        ...queryObj
      },
      order: [
        ["id", "DESC"]
      ]
    });
    return {
      pageSize,
      pageNumber,
      rows: result.rows,
      total: result.count
    };
  }

  /**
   * 上传/编辑物流信息
   *
   * @static
   * @param {Object} parmas
   * @memberof shopOrderModel
   */
  static async submitDeliveryInfo(parmas) {
    let {
      id,
      ...updateObj
    } = parmas;
    return await shopOrderListSchema.update({
      status: 3,
      ...updateObj
    }, {
      where: {
        status: {
          [Op.or]: [2, 3]
        },
        id
      }
    });
  }


  /**
   * 更改订单物流信息
   *
   * @static
   * @param {Object} parmas
   * @memberof shopOrderModel
   */
  static async updateAddressInfo(parmas) {
    let {
      id,
      ...updateObj
    } = parmas;
    return await shopOrderListSchema.update({
      ...updateObj
    }, {
      where: {
        status: {
          [Op.or]: [1, 2, 3]
        },
        id
      }
    });
  }

  /**
   * 新增收货地址
   *
   * @static
   * @param {Object} param 新增的字段
   * @memberof shopOrderModel
   */
  static async submitAddAddress(param) {
    return await shopUserDeliveryAddressSchema.create({
      ...param
    });
  }

  /**
   *
   * 查询所有物流公司
   * @static
   * @returns {Promise<*>}
   * @memberof shopOrderModel
   */
  static async getAllDeliveryCompany() {
    return await shopDeliveryCompanySchema.findAll();
  }

  /**
   *
   * 删除物流公司
   * @static
   * @param {*} id 物流公司id
   * @returns {Promise<*>}
   * @memberof shopOrderModel
   */
  static async deleteDeliveryCompany(id) {
    await shopDeliveryCompanySchema.destroy({
      where: {
        id
      }
    });
  }


  /**
   * 添加物流公司
   *
   * @static
   * @param {Array} deliveryCompanyArr 物流公司数组
   * @returns
   * @memberof shopOrderModel
   */
  static async addDeliveryCompany(deliveryCompanyArr) {
    return await shopDeliveryCompanySchema.bulkCreate(deliveryCompanyArr);
  }

  /**
   * 生成订单
   *
   * @static
   * @param {*} param
   * @returns
   * @memberof shopOrderModel
   */
  static async createOrder(param) {
    return await shopOrderListSchema.create(param);
  }

  /**
   * 生成子订单
   *
   * @static
   * @param {*} paramsArr
   * @returns
   * @memberof shopOrderModel
   */
  static async createSubOrder(paramsArr) {
    return await shopSubOrderListSchema.bulkCreate(paramsArr);
  }
}

module.exports = shopOrderModel;