require('dotenv').config();

const { Sequelize } = require('sequelize');


// Para debuggear, utilizar esta conexion local:
// const sequelize = new Sequelize(
//     'insumos_db',
//     'root',
//     '',
//     {
//         host: 'localhost',
//         dialect: 'mysql',
//         port: '3306'
//     }
// );


const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT
    }
);

module.exports = sequelize;