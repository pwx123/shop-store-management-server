const moment = require("moment");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define("shop_book_list", {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    status: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: 0
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    author: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    press: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    classify: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT(11, 2),
      allowNull: false
    },
    stockPrice: {
      type: DataTypes.FLOAT(11, 2),
      allowNull: false
    },
    salePrice: {
      type: DataTypes.FLOAT(11, 2),
      allowNull: false
    },
    isSell: {
      type: DataTypes.INTEGER(1),
      allowNull: false,
      defaultValue: 1
    },
    imageUrl: {
      type: DataTypes.STRING(200)
    },
    description: {
      type: DataTypes.STRING(500),
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