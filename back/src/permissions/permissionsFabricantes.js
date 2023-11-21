const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

function permissionsFabricantes() {
  
    const parseoAdmin = 1;
    return async function (req, res, next) {
      console.log("Hasta acá (1)");
      let token = req.headers["x-access-token"] || req.headers["authorization"];
  
      if (!token) {
        return res.status(401).send({
          error: "Es necesario un token de autenticación",
        });
      }
  
      if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
      }
  
      jwt.verify(token, "clavesecreta", async (error, decoded) => {
        if (error) {
          return res.status(401).json({
            message: "El token no es válido",
          });
        } else {
          const userId = decoded.userId;
          console.log("Hasta acá (2)");
          try {
            const usuario = await User.findOne({
              where: { usuario_id: userId },
            });
            console.log(usuario.rol);
            if (usuario.rol == parseoAdmin) {  // si el usuario es rol admin se le da siguiente
  
              return next();
            } else {
              // El usuario no tiene los permisos requeridos
              return res.status(403).json({
                ok: false,
                status: 403,
                message: "No tiene los permisos requeridos",
              });
            }
          } catch (error) {
            console.error(error);
            res.status(500).json({
              ok: false,
              status: 500,
              message: "Error al obtener los permisos",
            });
          }
        }
      });
    };
  }

  
module.exports = {
   permissionsFabricantes
  };