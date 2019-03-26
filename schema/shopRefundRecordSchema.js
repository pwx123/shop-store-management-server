const moment = require("moment");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define("shop_refund_record", {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    refundOrderId: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    orderNumId: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    userName: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    refundMoney: {
      type: DataTypes.FLOAT(11, 2),
      allowNull: true
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