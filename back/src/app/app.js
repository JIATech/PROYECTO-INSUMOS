// Configurando la app:
const express = require("express");
const morgan = require("morgan");
const insumoRouter = require("../routers/insumo.router");
const userRouter = require("../routers/user.router");
const fabricanteRouter = require("../routers/fabricante.router");
const app = express();
const cors = require("cors");
const keys = require("../connection/keys");

//Swagger
const fs = require('fs');
const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Insumos API',
      version: '1.0.0',
      description: 'Documentación Insumos API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  };

// Opciones de configuración Swagger
const options = {
    swaggerDefinition, 
    //Rutas a archivos con documentación
    apis: ['C:/Users/j.arnaboldi.spb/OneDrive/Proyecto Prueba DTI/INSUMOS-Prueba/back/src/controllers/*.js', 
    'C:/Users/j.arnaboldi.spb/OneDrive/Proyecto Prueba DTI/INSUMOS-Prueba/back/src/models/*.js', 
  'C:/Users/j.arnaboldi.spb/OneDrive/Proyecto Prueba DTI/INSUMOS-Prueba/back/src/routers/*.js', 
'C:/Users/j.arnaboldi.spb/OneDrive/Proyecto Prueba DTI/INSUMOS-Prueba/back/src/validations/*.js'],
  };

  const swaggerSpec = swaggerJsDoc(options);
  fs.writeFile(
    path.join(__dirname, 'openapi.json'),
    JSON.stringify(swaggerSpec, null, 2),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
    }
  )

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(cors());

app.set("key", keys.key);

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("insumos app");
});

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use("/api/v1", insumoRouter);

app.use("/api/v1", userRouter);

app.use("/api/v1", fabricanteRouter);


module.exports = app;
