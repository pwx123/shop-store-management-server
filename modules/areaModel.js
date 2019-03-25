const db = require("../config/dbConnect");
const sequelize = db.sequelize;
const provinceSchema = sequelize.import("../schema/provinceSchema");
const citySchema = sequelize.import("../schema/citySchema");
const countrySchema = sequelize.import("../schema/countrySchema");

class indexModel {
  /**
   * 获取省份
   *
   * @static
   * @memberof indexModel
   */
  static async getProvince() {
    return await provinceSchema.findAll({
      attributes: {
        exclude: ["id"]
      },
    });
  }

  /**
   * 根据省份获取市
   *
   * @static
   * @param {string} provinceId 省份id
   * @memberof indexModel
   */
  static async getCityByProvince(provinceId) {
    return await citySchema.findAll({
      attributes: {
        exclude: ["id", "provinceId"]
      },
      where: {
        provinceId
      }
    });
  }

  /**
   * 根据市获取县
   *
   * @static
   * @param {string} cityId 市id
   * @memberof indexModel
   */
  static async getCountryByCity(cityId) {
    return await countrySchema.findAll({
      attributes: {
        exclude: ["id", "cityId"]
      },
      where: {
        cityId
      }
    });
  }
}

module.exports = indexModel;