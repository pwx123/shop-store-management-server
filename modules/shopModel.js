const db = require("../config/dbConnect");
const sequelize = db.sequelize;
const Op = sequelize.Op;
const shopSchema = sequelize.import("../schema/shopSchema");
const shopOptionRecordSchema = sequelize.import("../schema/shopOptionRecordSchema");
const hasEmpty = require("../utils/utils").hasEmpty;
const getUncertainSqlObj = require("./../utils/utils").getUncertainSqlObj;

class shopModel {
  /**
   *
   * 查询店铺信息
   * @static
   * @returns {Promise<*>}
   * @memberof shopModel
   */
  static async getUserInfo() {
    return await shopSchema.findOne();
  }

  /**
   * 修改数据
   *
   * @static
   * @param {Object} parmas
   * @returns
   * @memberof shopModel
   */
  static async update(parmas) {
    return await shopSchema.update({
      ...parmas
    }, {
      where: {}
    });
  }

  /**
   * 查询店铺操作列表  分页
   *
   * @static
   * @memberof shopModel
   */
  static async getOptionRecord(parmas) {
    let {
      pageSize,
      pageNumber,
      startTime,
      endTime,
      name,
      optionType
    } = parmas;
    let searchObj = getUncertainSqlObj({
      optionType
    });
    if (!hasEmpty(name)) {
      searchObj[Op.or] = [{
        optionName: name
      }, {
        optionNickname: name
      }];
    }
    let result = await shopOptionRecordSchema.findAndCountAll({
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
   * 生成操作记录
   *
   * @static
   * @param {*} params
   * @memberof shopModel
   */
  static async createOptionRecord(params) {
    shopOptionRecordSchema.create({
      ...params
    });
  }
}

module.exports = shopModel;