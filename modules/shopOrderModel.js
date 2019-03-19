const db = require('../config/dbConnect');
const sequelize = db.sequelize;
const Op = sequelize.Op;
const shopOrderListSchema = sequelize.import('../schema/shopOrderListSchema');
const shopSubOrderListSchema = sequelize.import('../schema/shopSubOrderListSchema');
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
}

module.exports = shopOrderModel;