const { Model, DataTypes } = require("sequelize");
const sequelize = require('../connection/database');


class usuarios extends Model {}


usuarios.init(
  {
    usuario: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
  },
  {
    sequelize,
    modelName: "usuarios",
    tableName: 'usuarios',
    timestamps: true
  }
);


module.exports = usuarios;