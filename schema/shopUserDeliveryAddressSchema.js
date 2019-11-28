const moment = require("moment");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define("shop_user_delivery", {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0
    },
    deliveryName: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    deliveryMobile: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    provinceId: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    cityId: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    countryId: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    isDefault: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0
    },
    detailAddress: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue("createdAt")).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    updatedAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue("updatedAt")).format("YYYY-MM-DD HH:mm:ss");
      }
    }
  }, {
    timestamps: false,
    freezeTableName: true
  });
};