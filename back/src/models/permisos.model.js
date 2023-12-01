const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection/database');

class permisos extends Model {}

permisos.init(
  {
    permiso: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    modelName: 'permisos',
    tableName: 'permisos',
    timestamps: true
  }
);

module.exports = permisos;
