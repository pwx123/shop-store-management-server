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
   * 修改昵称
   *
   * @static
   * @param {*} nickname 昵称
   * @param {*} loginUser 用户手机号
   * @returns
   * @memberof adminUserModel
   */
  static async updateNickname(nickname, loginUser) {
    return await adminUserSchema.update({
      nickname
    }, {
      where: {
        name: loginUser
      }
    })
  }

  /**
   * 更改密码
   *
   * @static
   * @param {*} pwd 新密码
   * @param {*} loginUser 用户手机号
   * @returns
   * @memberof adminUserModel
   */
  static async updatePassword(pwd, loginUser) {
    return await adminUserSchema.update({
      pwd
    }, {
      where: {
        name: loginUser
      }
    })
  }

  static async updateAvatar(avatarUrl, loginUser) {
    return await adminUserSchema.update({
      avatarUrl
    }, {
      where: {
        name: loginUser
      }
    })
  }
}

module.exports = adminUserModel;