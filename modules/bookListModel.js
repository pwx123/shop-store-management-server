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
        status: 0,
        createdAt: {
          [Op.gt]: startTime,
          [Op.lt]: endTime,
        },
        ...likeObj
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

  /**
   * 删除列表中的图书
   *
   * @static
   * @param {*} ids 图书id 逗号间隔
   * @returns
   * @memberof bookListModel
   */
  static async deleteBooks(ids) {
    return await bookListSchema.update({
      status: 1
    },{
      where: {
        id: {
          [Op.in]: ids.split(',')
        }
      }
    })
  }

  /**
   * 更新图书
   *
   * @static
   * @param {*} param
   * @returns
   * @memberof bookListModel
   */
  static async updateBook(param) {
    let {
      id,
      stock,
      ...updateData
    } = param;
    let str = stock >= 0 ? `+${stock}` : `${stock}`;
    return await bookListSchema.update({
      stock: sequelize.literal('`stock` ' + str),
      updatedAt: new Date(),
      ...updateData
    }, {
      where: {
        id
      }
    })
  }

  /**
   * 批量插入图书
   *
   * @static
   * @param {Array} bookArr
   * @memberof bookListModel
   */
  static async insertBook(bookArr) {
    return await bookListSchema.bulkCreate(bookArr);
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

  // 新增分类
  static async addClassify(classifyName) {
    return await classifySchema.create({
      name: classifyName
    })
  }
}

module.exports = bookListModel;