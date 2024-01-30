const { Model, DataTypes } = require("sequelize");
const sequelize = require('../connection/database');

class insumos extends Model {}


insumos.init(
  {
    insumo: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    precio: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
    },
    tags: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "insumos",
    tableName: 'insumos',
    timestamps: true,
  }
);

module.exports = insumos;