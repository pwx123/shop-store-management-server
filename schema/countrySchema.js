module.exports = function (sequelize, DataTypes) {
  return sequelize.define("shop_delivery_country", {
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
    countryId: {
      type: DataTypes.STRING(12),
      allowNull: false
    },
    cityId: {
      type: DataTypes.STRING(12),
      allowNull: false
    }
  }, {
    timestamps: false,
    freezeTableName: true
  });
};