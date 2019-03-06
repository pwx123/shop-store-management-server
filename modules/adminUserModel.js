const db = require('../config/dbConnect');
const sequelize = db.sequelize;
const adminUserSchema = sequelize.import('../schema/adminUserSchema');

class adminUserModel {
  /**
   *
   * 根据用户名查询信息
   * @static
   * @param {*} name 用户名
   * @returns {Promise<*>}
   * @memberof adminUserModel
   */
  static async getUserInfo(name) {
    return await adminUserSchema.findOne({
      where: {
        name
      }
    })
  }

  /**
   * 插入数据
   *
   * @static
   * @param {*} name
   * @param {*} pwd
   * @returns
   * @memberof adminUserModel
   */
  static async create(user) {
    let {
      name,
      pwd
    } = user;
    return await adminUserSchema.create({
      name,
      pwd
    })
  }
}

module.exports = adminUserModel;