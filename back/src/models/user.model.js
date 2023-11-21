const { Model, DataTypes } = require("sequelize");
const sequelize = require('../connection/database');


class User extends Model {}

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - usuario
 *         - password
 *         - email
 *         - rol
 *       properties:
 *         usuario_id:
 *           type: integer
 *           description: ID autogenerado para el usuario
 *         usuario:
 *           type: string
 *           description: Nombre de usuario
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *         email:
 *           type: string
 *           description: Dirección de correo electrónico del usuario
 *         rol:
 *           type: integer
 *           description: Rol del usuario en el sistema
 *       example:
 *         usuario_id: 1
 *         usuario: "usuarioejemplo"
 *         password: "contraseña123"
 *         email: "usuario@ejemplo.com"
 *         rol: 2
 */
User.init(
  {
    usuario_id: {
      type: DataTypes.INTEGER,
    //   defaultValue: DataTypes.UUIDV4,
      autoIncrement: true,
      primaryKey: true,
    },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false, // no puede ser nulo
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // no puede ser nulo
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false, // no puede ser nulo
    },
    rol: {
      type: DataTypes.INTEGER,  
      allowNull: false,
    }
   
  },
  {
    sequelize,
    modelName: "usuarios",
  }
);


module.exports = User;