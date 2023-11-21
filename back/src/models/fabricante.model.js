const {  Model, DataTypes } = require("sequelize");

const sequelize = require('../connection/database');
class Fabricantes extends Model {}

/**
 * @swagger
 * components:
 *   schemas:
 *     Fabricante:
 *       type: object
 *       required:
 *         - nombre
 *         - cuit
 *         - empresa
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado para el fabricante
 *         nombre:
 *           type: string
 *           description: Nombre del fabricante
 *         cuit:
 *           type: string
 *           description: CUIT del fabricante
 *         empresa:
 *           type: string
 *           description: Nombre de la empresa del fabricante
 *       example:
 *         id: 1
 *         nombre: "Fabricante Ejemplo"
 *         cuit: "30-12345678-9"
 *         empresa: "Empresa Ejemplo"
 */

Fabricantes.init(
  {
    id: {
      type: DataTypes.INTEGER,
    //   defaultValue: DataTypes.UUIDV4, //autoincrementable
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false, // no puede ser nulo
    },
    cuit: {
        type: DataTypes.STRING,
        allowNull: false, // no puede ser nulo
    },
    empresa: {
        type: DataTypes.STRING,
        allowNull: false, // no puede ser nulo
    }
 
    },
   
  {
    sequelize,
    modelName: "Fabricantes",
  }
);

module.exports = Fabricantes;

async function testConnection(){
    try {
        await sequelize.authenticate()
        console.log("Todo correcto.");
      } catch (err) {
        console.error("Algo salió mal.", err);
      }
  }

  testConnection();