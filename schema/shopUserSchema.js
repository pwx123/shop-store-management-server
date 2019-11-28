const moment = require("moment");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define("shop_user_list", {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    nickname: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    pwd: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    payPwd: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    sex: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    avatarUrl: {
      type: DataTypes.STRING(500),
      allowNull: true
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
