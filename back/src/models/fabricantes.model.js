const {  Model, DataTypes } = require("sequelize");
const sequelize = require('../connection/database');

class fabricantes extends Model {}


fabricantes.init(
  {
    nombreEmpresa: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
    cuit: {
        type: DataTypes.STRING,
        allowNull: false, 
    }
    },
  {
    sequelize,
    modelName: "fabricantes",
    tableName: 'fabricantes',
    timestamps: true
  }
);


module.exports = fabricantes;