const db = require('../config/dbConnect');
const sequelize = db.sequelize;
const Op = sequelize.Op;
const shopUserSchema = sequelize.import('../schema/shopUserSchema');
const hasEmpty = require("../utils/utils").hasEmpty;
const getUncertainSqlObj = require('./../utils/utils').getUncertainSqlObj;

class shopModel {
  /**
   *
   * 查询店铺用户信息
   * @static
   * @returns {Promise<*>}
   * @memberof shopModel
   */
  static async getShopUserInfo(parmas) {
    let {
      pageSize,
      pageNumber,
      startTime,
      endTime,
      name,
      status,
      sex
    } = parmas;
    let searchObj = getUncertainSqlObj({
      status,
      sex
    });
    if (!hasEmpty(name)) {
      searchObj[Op.or] = [{
        name: name
      }, {
        nickname: name
      }]
    }
    let result = await shopUserSchema.findAndCountAll({
      offset: pageSize * (pageNumber - 1),
      limit: pageSize,
      where: {
        createdAt: {
          [Op.gt]: startTime,
          [Op.lt]: endTime,
        },
        ...searchObj
      },
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

module.exports = shopModel;