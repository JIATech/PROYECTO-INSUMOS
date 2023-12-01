// Configurando la app:
const express = require("express");
const morgan = require("morgan");
const insumoRouter = require("../routers/insumo.router");
const userRouter = require("../routers/usuarios.router");
const fabricanteRouter = require("../routers/fabricante.router");
const cors = require("cors");
const keys = require("../connection/keys");
const sequelize = require("../connection/database");
const permisosController = require("../controllers/permisos.controller");
require('../asociaciones');
const app = express();

//Swagger
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

// Leer el archivo OpenAPI JSON
const openapiSpecification = JSON.parse(fs.readFileSync(path.join(__dirname, './openapi.json'), 'utf8'));

// const swaggerDefinition = {
//     openapi: '3.0.0',
//     info: {
//       title: 'Insumos API',
//       version: '1.0.0',
//       description: 'Documentación Insumos API',
//     },
//     servers: [
//       {
//         url: 'http://localhost:3000',
//         description: 'Servidor de Desarrollo',
//       },
//     ],
//     components: {
//       securitySchemes: {
//         bearerAuth: {
//           type: 'http',
//           scheme: 'bearer',
//           bearerFormat: 'JWT',
//         },
//       },
//     },
//   };



// // Opciones de configuración Swagger
// const options = {
//     swaggerDefinition, 
//     //Rutas a archivos con documentación
//     apis: ['C:/Users/j.arnaboldi.spb/OneDrive/Proyecto Prueba DTI/INSUMOS-Prueba/back/src/app/swaggerDoc.js'],
// };

// const swaggerSpec = swaggerJsDoc(options);
//   fs.writeFile(
//     path.join(__dirname, 'openapi.json'),
//     JSON.stringify(swaggerSpec, null, 2),
//     (err) => {
//       if (err) {
//         console.error(err);
//         return;
//       }
//     }
//   );

//Fin Swagger

app.use(cors());

app.use(morgan("dev"));

// Conectar a la base de datos y sincronizar modelos
sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida con éxito.');

    // Sincronizar todos los modelos
    return sequelize.sync();
  })
  .then(() => {
    console.log('Sincronización de modelos con la base de datos completada.');

    // Inicializar permisos
    return permisosController.initializePermisos();
  })
  .then(() => {
    console.log('Permisos inicializados con éxito.');
  })
  .catch(err => {
    console.error('Error durante la inicialización:', err);
  });
  


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));


app.set("key", keys.key);


app.get("/", (req, res) => {
  res.send("insumos app");
});

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use("/api/v1", insumoRouter);

app.use("/api/v1", userRouter);

app.use("/api/v1", fabricanteRouter);



module.exports = app;
