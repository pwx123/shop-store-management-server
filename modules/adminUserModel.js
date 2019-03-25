const db = require("../config/dbConnect");
const sequelize = db.sequelize;
const adminUserSchema = sequelize.import("../schema/adminUserSchema");

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
    });
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
    return await adminUserSchema.create({
      ...user
    });
  }

  /**
   * 修改数据
   *
   * @static
   * @param {Object} parmas
   * @param {*} loginUser 用户手机号
   * @returns
   * @memberof adminUserModel
   */
  static async update(parmas, loginUser) {
    return await adminUserSchema.update({
      ...parmas
    }, {
      where: {
        name: loginUser
      }
    });
  }
}

module.exports = adminUserModel;