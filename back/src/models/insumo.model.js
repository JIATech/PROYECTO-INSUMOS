const { Model, DataTypes } = require("sequelize");

const sequelize = require('../connection/database');

class Insumo extends Model {}

/**
 * @swagger
 * components:
 *   schemas:
 *     Insumo:
 *       type: object
 *       required:
 *         - insumo_name
 *         - price
 *         - is_stock
 *         - cantidad
 *         - tipo
 *       properties:
 *         insumo_id:
 *           type: integer
 *           description: ID autogenerado para el insumo
 *         insumo_name:
 *           type: string
 *           description: Nombre del insumo
 *         price:
 *           type: number
 *           format: float
 *           description: Precio del insumo
 *         is_stock:
 *           type: boolean
 *           description: Indica si el insumo está en stock
 *         cantidad:
 *           type: integer
 *           description: Cantidad disponible del insumo
 *         tipo:
 *           type: integer
 *           description: Tipo de insumo
 *       example:
 *         insumo_id: 1
 *         insumo_name: "Insumo Ejemplo"
 *         price: 100.50
 *         is_stock: true
 *         cantidad: 50
 *         tipo: 2
 */
Insumo.init(
  {
    insumo_id: {
      type: DataTypes.INTEGER,
    //   defaultValue: DataTypes.UUIDV4, //autoincrementable
      autoIncrement: true,
      primaryKey: true,
    },
    insumo_name: {
      type: DataTypes.STRING,
      allowNull: false, // no puede ser nulo
    },
    price: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: false,
    },
    is_stock: {
      type: DataTypes.BOOLEAN,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Insumo",
  }
);

module.exports = Insumo;