const fs = require('fs');
const path = require('path');
const swaggerJsDoc = require('swagger-jsdoc');

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
    // components: {
    //   securitySchemes: {
    //     bearerAuth: {
    //       type: 'http',
    //       scheme: 'bearer',
    //       bearerFormat: 'JWT',
    //     },
    //   },
    // },
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

  function generateOpenAPISpec() {
    const swaggerSpec = swaggerJsDoc(options);
    fs.writeFile(
      path.join(__dirname, 'openapi.json'),
      JSON.stringify(swaggerSpec, null, 2),
      (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('OpenAPI spec saved to openapi.json');
      }
    );
  }

  module.exports = generateOpenAPISpec;
