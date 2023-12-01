const { Model, DataTypes } = require('sequelize');
const sequelize = require('../connection/database');

class roles extends Model {}

roles.init(
    {
      rol: {
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
      modelName: 'roles',
      tableName: 'roles',
      timestamps: true
    }
);


module.exports = roles;
