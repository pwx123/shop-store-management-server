const moment = require("moment");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define("shop_option_record", {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    optionName: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    optionNickname: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    optionType: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0
    },
    remark: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue("createdAt")).format("YYYY-MM-DD HH:mm:ss");
      }
    }
  }, {
    timestamps: false,
    freezeTableName: true
  });
};