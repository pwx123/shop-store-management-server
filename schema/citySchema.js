module.exports = function (sequelize, DataTypes) {
  return sequelize.define("shop_delivery_city", {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    cityId: {
      type: DataTypes.STRING(12),
      allowNull: false
    },
    provinceId: {
      type: DataTypes.STRING(12),
      allowNull: false
    }
  }, {
    timestamps: false,
    freezeTableName: true
  });
};