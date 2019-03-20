const db = require('../config/dbConnect');
const sequelize = db.sequelize;
const Op = sequelize.Op;
const shopOrderListSchema = sequelize.import('../schema/shopOrderListSchema');
const shopSubOrderListSchema = sequelize.import('../schema/shopSubOrderListSchema');
const shopDeliveryCompanySchema = sequelize.import('../schema/shopDeliveryCompanySchema');
const hasEmpty = require("../utils/utils").hasEmpty;
const getUncertainSqlObj = require('./../utils/utils').getUncertainSqlObj;

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
      foreignKey: 'mainOrderId',
      sourceKey: 'id',
      as: {
        singular: 'orders',
        plural: 'orders'
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
        as: 'orders'
      }],
      order: [
        ['id', 'DESC']
      ]
    })
    return {
      pageSize,
      pageNumber,
      rows: result.rows,
      total: result.count
    }
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
          [Op.in]: ids.split(',')
        }
      }
    })
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
    })
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
    })
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
}

module.exports = shopOrderModel;