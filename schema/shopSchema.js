const moment = require("moment");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define("shop_info", {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    shopName: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(1),
      allowNull: false
    },
    description: {
      type: DataTypes.INTEGER(200),
      allowNull: true
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