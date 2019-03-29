const moment = require("moment");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define("shop_sub_order_list", {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    mainOrderId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    bookId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    bookName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    bookTitle: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    bookNum: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    bookPrice: {
      type: DataTypes.FLOAT(11, 2),
      allowNull: false
    },
    bookSalePrice: {
      type: DataTypes.FLOAT(11, 2),
      allowNull: false
    },
    bookImageUrl: {
      type: DataTypes.STRING(200),
      allowNull: true
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