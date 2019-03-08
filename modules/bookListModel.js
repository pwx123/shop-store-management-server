const db = require('../config/dbConnect');
const sequelize = db.sequelize;
const Op = sequelize.Op;
const bookListSchema = sequelize.import('../schema/bookListSchema');
const classifySchema = sequelize.import('../schema/classifySchema');
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

    let result = await bookListSchema.findAndCountAll({
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
      rows: result.rows,
      total: result.count
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
   *
   * 查询所有图书分类
   * @static
   * @returns {Promise<*>}
   * @memberof bookListModel
   */
  static async getAllClassify() {
    return await classifySchema.findAll();
  }

  /**
   *
   * 删除图书分类
   * @static
   * @param {*} id 分类id
   * @returns {Promise<*>}
   * @memberof bookListModel
   */
  static async deleteClassify(id) {
    await classifySchema.destroy({
      where: {
        id
      }
    });
    return await sequelize.query(`UPDATE \`book_list\` SET \`classify\`=TRIM(BOTH ',' FROM replace(concat(',',\`classify\`,','), ',${id},', '')) WHERE FIND_IN_SET('${id}',classify)`);
  }
}

module.exports = bookListModel;