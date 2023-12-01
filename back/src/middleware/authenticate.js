// middleware/authenticate.js
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { usuarios, roles, roles_permisos, permisos } = require('../asociaciones');


const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Recuperar usuario y rol
    const usuario = await usuarios.findByPk(decoded.id, {
      include: [{
        model: roles,
        include: [{
          model: roles_permisos,
          include: [permisos]
        }]
      }]
    });
    
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    
    // Adjuntar usuario y permisos al objeto de solicitud
    req.usuario = usuario;
    req.permisos = usuario.rol.roles_permisos.map(rp => rp.permiso.permiso);
    
    next();
  } catch (error) {
    res.status(401).json({ message: "Autenticación fallida: " + error.message });
  }
};

module.exports = authenticate;
