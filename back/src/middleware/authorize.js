// middleware/authorize.js

const authorize = (permisoRequerido) => {
    return (req, res, next) => {
      if (req.permisos && req.permisos.includes(permisoRequerido)) {
        next(); // El usuario tiene el permiso, continuar
      } else {
        res.status(403).json({ message: "No tiene permiso para realizar esta acción" });
      }
    };
  };
  
  module.exports = authorize;
  