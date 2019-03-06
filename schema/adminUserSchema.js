const moment = require('moment');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('admin_user', {
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
    pwd: {
      type: DataTypes.STRING(255),
      allowNull: false
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