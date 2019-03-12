const db = require('../config/dbConnect');
const sequelize = db.sequelize;
const bookSchema = sequelize.import('../schema/bookSchema');

class bookModel {
  /**
   *
   * 查询店铺信息
   * @static
   * @returns {Promise<*>}
   * @memberof bookModel
   */
  static async getUserInfo() {
    return await bookSchema.findOne({})
  }

  /**
   * 修改数据
   *
   * @static
   * @param {Object} data 
   * @returns
   * @memberof bookModel
   */
  static async update(data) {
    return await bookSchema.update({
      ...data
    })
  }
}

module.exports = bookModel;