const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('shop_stock_record', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    bookId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    bookName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    stockNum: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    stockPrice: {
      type: DataTypes.FLOAT(11, 2),
      allowNull: true
    },
    type: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    remark: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      get() {
        return moment(this.getDataValue('createdAt')).format('YYYY-MM-DD HH:mm:ss');
      }
    }
  }, {
    timestamps: false,
    freezeTableName: true
  })
}