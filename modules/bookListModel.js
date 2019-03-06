const db = require('../config/dbConnect');
const sequelize = db.sequelize;
const Op = sequelize.Op;
const bookListSchema = sequelize.import('../schema/bookListSchema');
const getUncertainLikeSqlObj = require('../utils/utils').getUncertainLikeSqlObj;

class bookListModel {
  /**
   * 查询图书列表
   *
   * @static
   * @param {*} parmas
   * @returns
   * @memberof bookListModel
   */
  static async getBookList(parmas) {
    let {
      pageSize,
      pageNumber,
      startTime,
      endTime,
      name,
      author,
      press
    } = parmas;
    let likeObj = getUncertainLikeSqlObj({
      name,
      author,
      press
    });

    let result = await bookListSchema.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'total']
      ],
      where: {
        createdAt: {
          [Op.gt]: startTime,
          [Op.lt]: endTime,
        },
        ...likeObj
      }
    })
    let total = parseInt(result[0].get('total'));
    let rows = await bookListSchema.findAll({
      offset: pageSize * (pageNumber - 1),
      limit: pageSize,
      where: {
        createdAt: {
          [Op.gt]: startTime,
          [Op.lt]: endTime,
        },
        ...likeObj
      }
    })
    return {
      pageSize,
      pageNumber,
      total,
      rows
    }
  }

  /**
   * 删除列表中的图书
   *
   * @static
   * @param {*} ids 图书id 逗号间隔
   * @returns
   * @memberof bookListModel
   */
  static async deleteBooks(ids) {
    return await bookListSchema.destroy({
      where: {
        id: {
          [Op.in]: ids.split(',')
        }
      }
    })
  }

  /**
   * 获取列表总数
   *
   * @static
   * @returns
   * @memberof bookListModel
   */
  static async getTotalNum() {
    return await bookListSchema.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'total']
      ]
    })
  }
}

module.exports = bookListModel;