const db = require('../config/dbConnect');
const sequelize = db.sequelize;
const Op = sequelize.Op;
const shopUserSchema = sequelize.import('../schema/shopUserSchema');
const provinceSchema = sequelize.import('../schema/provinceSchema');
const citySchema = sequelize.import('../schema/citySchema');
const countrySchema = sequelize.import('../schema/countrySchema');
const shopUserDeliveryAddress = sequelize.import('../schema/shopUserDeliveryAddress');
const hasEmpty = require("../utils/utils").hasEmpty;
const getUncertainSqlObj = require('./../utils/utils').getUncertainSqlObj;

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
      }]
    }
    let result = await shopUserSchema.findAndCountAll({
      offset: pageSize * (pageNumber - 1),
      limit: pageSize,
      where: {
        createdAt: {
          [Op.gt]: startTime,
          [Op.lt]: endTime,
        },
        ...searchObj
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
   * 查询用户收货地址
   *
   * @static
   * @param {int} useId 用户id
   * @memberof shopModel
   */
  static async getUserDeliveryAddress(userId) {
    shopUserDeliveryAddress.belongsTo(provinceSchema, {
      foreignKey: 'provinceId',
      targetKey: 'provinceId'
    });
    shopUserDeliveryAddress.belongsTo(citySchema, {
      foreignKey: 'cityId',
      targetKey: 'cityId'
    });
    shopUserDeliveryAddress.belongsTo(countrySchema, {
      foreignKey: 'countryId',
      targetKey: 'countryId'
    });
    return await shopUserDeliveryAddress.findAll({
      attributes: {
        include: [
          [sequelize.col('delivery_province.name'), 'provinceName'],
          [sequelize.col('delivery_city.name'), 'cityName'],
          [sequelize.col('delivery_country.name'), 'countryName']
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
    })
  }
  // static async getUserDeliveryAddress(userId) {
  //   return await sequelize.query(`SELECT
  //   \`shop_user_delivery\`.\`id\`,
  //   \`shop_user_delivery\`.\`userId\`,
  //   \`shop_user_delivery\`.\`deliveryName\`,
  //   \`shop_user_delivery\`.\`deliveryMobile\`,
  //   \`delivery_province\`.\`name\` AS \`provinceName\`,
  //   \`delivery_city\`.\`name\` AS \`cityName\`,
  //   \`delivery_country\`.\`name\` AS \`countryName\`,
  //   \`shop_user_delivery\`.\`detailAddress\`,
  //   \`shop_user_delivery\`.\`isDefault\`,
  //   \`shop_user_delivery\`.\`createdAt\`,
  //   \`shop_user_delivery\`.\`updatedAt\` 
  // FROM
  //   \`shop_user_delivery\`,
  //   \`delivery_province\`,
  //   \`delivery_city\`,
  //   \`delivery_country\` 
  // WHERE
  //   \`shop_user_delivery\`.\`userId\` = ${userId}
  //   AND \`shop_user_delivery\`.\`provinceId\` = \`delivery_province\`.\`provinceId\` 
  //   AND \`shop_user_delivery\`.\`cityId\` = \`delivery_city\`.\`cityId\` 
  //   AND \`shop_user_delivery\`.\`countryId\` = \`delivery_country\`.\`countryId\`;`, {
  //     type: sequelize.QueryTypes.SELECT
  //   });
  // }
}

module.exports = shopModel;