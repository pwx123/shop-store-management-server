const moment = require("moment");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define("shop_order_list", {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    orderId: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER(11),
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
    orderNum: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    orderMoney: {
      type: DataTypes.FLOAT(11, 2),
      allowNull: false
    },
    deliveryMoney: {
      type: DataTypes.FLOAT(11, 2),
      allowNull: false
    },
    totalMoney: {
      type: DataTypes.FLOAT(11, 2),
      allowNull: false
    },
    deliveryId: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    deliveryOrderId: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    deliveryAddressId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    remark: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue("createdAt")).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    deliveryAt: {
      type: DataTypes.DATE,
      allowNull: true,
      get() {
        return this.getDataValue("deliveryAt") ? moment(this.getDataValue("deliveryAt")).format("YYYY-MM-DD HH:mm:ss") : "";
      }
    },
    dealAt: {
      type: DataTypes.DATE,
      allowNull: true,
      get() {
        return this.getDataValue("dealAt") ? moment(this.getDataValue("dealAt")).format("YYYY-MM-DD HH:mm:ss") : "";
      }
    }
  }, {
    timestamps: false,
    freezeTableName: true
  });
};
