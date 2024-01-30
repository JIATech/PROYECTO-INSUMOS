// middleware/authenticate.js
require("dotenv").config();
const jwt = require("jsonwebtoken");
const {
  usuarios,
  roles,
  roles_permisos,
  permisos,
} = require("../asociaciones");

const authenticate = async (req, res, next) => {
  try {
    let token;

    // Check for Authorization header
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check for token in cookies
    if (!token && req.cookies) {
      token = req.cookies.token;
    }

    // Check for token in query parameters
    if (!token && req.query.token) {
      token = req.query.token;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Recuperar usuario y rol
    const usuario = await usuarios.findByPk(decoded.id, {
      include: [
        {
          model: roles,
          include: [
            {
              model: roles_permisos,
              include: [permisos],
            },
          ],
        },
      ],
    });

    if (!usuario) {
      throw new Error("Usuario no encontrado");
    }

    // Adjuntar usuario y permisos al objeto de solicitud
    req.usuario = usuario;
    req.permisos = usuario.role.roles_permisos.map((rp) => rp.permiso.permiso);

    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: "Autenticación fallida: " + error.message });
  }
};

module.exports = authenticate;
