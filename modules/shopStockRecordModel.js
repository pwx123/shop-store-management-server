const db = require("../config/dbConnect");
const sequelize = db.sequelize;
const Op = sequelize.Op;
const shopStockRecordSchema = sequelize.import("../schema/shopStockRecordSchema");
const getUncertainSqlObj = require("./../utils/utils").getUncertainSqlObj;
const getUncertainLikeSqlObj = require("./../utils/utils").getUncertainLikeSqlObj;

class shopModel {

  /**
   * 查询店铺操作列表  分页
   *
   * @static
   * @memberof shopModel
   */
  static async getStockRecordList(parmas) {
    let {
      pageSize,
      pageNumber,
      startTime,
      endTime,
      bookName,
      type
    } = parmas;
    let searchObj = getUncertainSqlObj({
      type
    });
    let likeObj = getUncertainLikeSqlObj({
      bookName
    });
    let result = await shopStockRecordSchema.findAndCountAll({
      offset: pageSize * (pageNumber - 1),
      limit: pageSize,
      where: {
        createdAt: {
          [Op.gt]: startTime,
          [Op.lt]: endTime,
        },
        ...searchObj,
        ...likeObj
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
   * 生成进货记录
   *
   * @static
   * @param {*} params
   * @memberof shopModel
   */
  static async createStockRecord(paramsArr) {
    shopStockRecordSchema.bulkCreate(paramsArr);
  }
}

module.exports = shopModel;