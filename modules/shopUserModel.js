const db = require("../config/dbConnect");
const sequelize = db.sequelize;
const Op = sequelize.Op;
const shopUserSchema = sequelize.import("../schema/shopUserSchema");
const provinceSchema = sequelize.import("../schema/provinceSchema");
const citySchema = sequelize.import("../schema/citySchema");
const countrySchema = sequelize.import("../schema/countrySchema");
const shopUserDeliveryAddressSchema = sequelize.import("../schema/shopUserDeliveryAddressSchema");
const hasEmpty = require("../utils/utils").hasEmpty;
const getUncertainSqlObj = require("./../utils/utils").getUncertainSqlObj;

class shopModel {
  /**
   *
   * 查询店铺用户信息
   * @static
   * @returns {Promise<*>}
   * @memberof shopModel
   */
  static async getShopUserInfo(parmas) {
    let {
      pageSize,
      pageNumber,
      startTime,
      endTime,
      name,
      status,
      sex
    } = parmas;
    let searchObj = getUncertainSqlObj({
      status,
      sex
    });
    if (!hasEmpty(name)) {
      searchObj[Op.or] = [{
        name: name
      }, {
        nickname: name
      }];
    }
    let createdAt = {};
    if (!hasEmpty(startTime)) {
      createdAt[Op.gt] = startTime;
    }
    if (!hasEmpty(endTime)) {
      createdAt[Op.lt] = endTime;
    }
    // symbols keys 不能判断
    if (Object.getOwnPropertySymbols(createdAt).length) {
      searchObj.createdAt = createdAt;
    }
    let result = await shopUserSchema.findAndCountAll({
      offset: pageSize * (pageNumber - 1),
      limit: pageSize,
      where: {
        ...searchObj
      },
      order: [
        ["id", "DESC"]
      ]
    });
    return {
      pageSize,
      pageNumber,
      rows: result.rows,
      total: result.count
    };
  }

  /**
   * 查询用户收货地址
   *
   * @static
   * @param {int} useId 用户id
   * @memberof shopModel
   */
  static async getUserDeliveryAddress(userId) {
    shopUserDeliveryAddressSchema.belongsTo(provinceSchema, {
      foreignKey: "provinceId",
      targetKey: "provinceId"
    });
    shopUserDeliveryAddressSchema.belongsTo(citySchema, {
      foreignKey: "cityId",
      targetKey: "cityId"
    });
    shopUserDeliveryAddressSchema.belongsTo(countrySchema, {
      foreignKey: "countryId",
      targetKey: "countryId"
    });
    return await shopUserDeliveryAddressSchema.findAll({
      attributes: {
        include: [
          [sequelize.col("shop_delivery_province.name"), "provinceName"],
          [sequelize.col("shop_delivery_city.name"), "cityName"],
          [sequelize.col("shop_delivery_country.name"), "countryName"]
        ]
      },
      include: [{
        model: provinceSchema,
        attributes: []
      }, {
        model: citySchema,
        attributes: []
      }, {
        model: countrySchema,
        attributes: []
      }],
      where: {
        userId
      }
    });
  }

  /**
   * 根据id查询收货地址信息
   *
   * @static
   * @param {*} id
   * @memberof shopModel
   */
  static async getOrderAddressById(id) {
    shopUserDeliveryAddressSchema.belongsTo(provinceSchema, {
      foreignKey: "provinceId",
      targetKey: "provinceId"
    });
    shopUserDeliveryAddressSchema.belongsTo(citySchema, {
      foreignKey: "cityId",
      targetKey: "cityId"
    });
    shopUserDeliveryAddressSchema.belongsTo(countrySchema, {
      foreignKey: "countryId",
      targetKey: "countryId"
    });
    return await shopUserDeliveryAddressSchema.findAll({
      attributes: {
        include: [
          [sequelize.col("shop_delivery_province.name"), "provinceName"],
          [sequelize.col("shop_delivery_city.name"), "cityName"],
          [sequelize.col("shop_delivery_country.name"), "countryName"]
        ]
      },
      include: [{
        model: provinceSchema,
        attributes: []
      }, {
        model: citySchema,
        attributes: []
      }, {
        model: countrySchema,
        attributes: []
      }],
      where: {
        id
      },
      raw: true
    });
  }

  /**
   * 更新
   *
   * @static
   * @param {obj} id 用户id
   * @returns
   * @memberof shopModel
   */
  static async update(parmas) {
    let {
      id,
      ...updateData
    } = parmas;
    return await shopUserSchema.update({
      ...updateData
    }, {
      where: {
        id
      }
    });
  }


}

module.exports = shopModel;
