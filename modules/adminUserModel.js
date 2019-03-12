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

  /**
   * 修改数据
   *
   * @static
   * @param {Object} data 
   * @param {*} loginUser 用户手机号
   * @returns
   * @memberof adminUserModel
   */
  static async update(data, loginUser) {
    return await adminUserSchema.update({
      ...data
    }, {
      where: {
        name: loginUser
      }
    })
  }
}

module.exports = adminUserModel;