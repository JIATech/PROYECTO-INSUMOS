const { Model, DataTypes } = require("sequelize");
const sequelize = require('../connection/database');


class pedidos extends Model {}

pedidos.init(
  {
    cantidad: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fechaPedido: {
      type: DataTypes.STRING,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'pedidos',
    tableName: 'pedidos',
    timestamps: true
  }
);
  
  

module.exports = pedidos;