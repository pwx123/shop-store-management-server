const db = require("../config/dbConnect");
const sequelize = db.sequelize;
const adminUserSchema = sequelize.import("../schema/adminUserSchema");

class indexModel {
  /**
   *
   * 根据用户名查询信息 排除密码
   * @static
   * @param {*} name 用户名
   * @returns {Promise<*>}
   * @memberof indexModel
   */
  static async getUserInfo(name) {
    return await adminUserSchema.findOne({
      attributes: {
        exclude: ["pwd", "id"]
      },
      where: {
        name
      }
    });
  }
}

module.exports = indexModel;