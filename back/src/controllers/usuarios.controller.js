const usuarios = require("../models/usuarios.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { Op } = require('sequelize');
const keys = require("../connection/keys");
const roles = require("../models/roles.model");
const rolesPermisos = require("../models/roles_permisos.model");
const permisos = require("../models/permisos.model");
const fabricantes = require("../models/fabricantes.model");

const usuariosController = {};

// Crear un nuevo usuario
usuariosController.createUsuario = async (req, res) => {
  try {
    const { usuario, password, email, rolNombre, nombreEmpresa, cuit } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Verificar si el rol existe
    let rol = await roles.findOne({ where: { rol: rolNombre } });
    if (!rol) {
      // Crear rol si no existe
      rol = await roles.create({ rol: rolNombre, description: `Rol de ${rolNombre}` });
    }

    // Determinar y asignar permisos basados en el rol
    if (rolNombre === 'administrador') {
      // Asignar todos los permisos al rol de administrador
      const todosLosPermisos = await permisos.findAll();
      for (const permiso of todosLosPermisos) {
        await rolesPermisos.create({ rolesId: rol.id, permisosId: permiso.id });
      }
    } else if (rolNombre === 'cliente' || rolNombre === 'fabricante') {
      // Permisos por defecto para el rol "cliente"
      const permisosCliente = [
        'CrearPedido',
        'ModificarPedido',
        'EliminarPedido'
      ];

      // Encuentra los permisos por nombre
      const permisosAsignados = await permisos.findAll({
        where: {
          permiso: permisosCliente
        }
      });

      // Asignar los permisos encontrados al rol "cliente"
      for (const permiso of permisosAsignados) {
        await rolesPermisos.create({ rolesId: rol.id, permisosId: permiso.id });
      }
    }

    let fabricantesId = null;
    if (rolNombre === 'fabricante' || rolNombre === 'cliente') {
      // Verificar si ya existe un fabricante con el mismo CUIT
      const fabricanteExistente = await fabricantes.findOne({ where: { cuit } });
      if (fabricanteExistente) {
        return res.status(409).json({ message: "El fabricante ya existe" });
      }

      // Crear fabricante si no existe
      const nuevoFabricante = await fabricantes.create({ nombreEmpresa, cuit });
      fabricantesId = nuevoFabricante.id;
    }

    // Crear usuario y asignar el rol
    const nuevoUsuario = await usuarios.create({ usuario, password: hashedPassword, email, rolesId: rol.id, fabricantesId });
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el usuario", error });
  }
};



// Obtener todos los usuarios
usuariosController.getAllUsuarios = async (req, res) => {
  try {
    const todosLosUsuarios = await usuarios.findAll();
    res.status(200).json(todosLosUsuarios);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error });
  }
};

// Obtener un usuario por ID
usuariosController.getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await usuarios.findByPk(id);
    if (usuario) {
      res.status(200).json(usuario);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario", error });
  }
};

// Actualizar un usuario
usuariosController.updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario, password, email } = req.body;
    const usuarioExistente = await usuarios.findByPk(id);
    if (usuarioExistente) {
      usuarioExistente.usuario = usuario ?? usuarioExistente.usuario;
      usuarioExistente.password = password ? await bcrypt.hash(password, 10) : usuarioExistente.password;
      usuarioExistente.email = email ?? usuarioExistente.email;
      await usuarioExistente.save();
      res.status(200).json(usuarioExistente);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el usuario", error });
  }
};

// Eliminar un usuario
usuariosController.deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await usuarios.findByPk(id);
    if (usuario) {
      await usuario.destroy();
      res.status(200).json({ message: "Usuario eliminado correctamente" });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario", error });
  }
};

// Inicio de sesión
usuariosController.login = async (req, res) => {
  try {
    const { usuario, password } = req.body;
    const user = await usuarios.findOne({ 
      where: { 
        [Op.or]: [
          { usuario: usuario },
          { email: usuario }
        ]
      }
    });
    if (user && await bcrypt.compare(password, user.password)) {
      
      // buscar usuario por ID y devolver el rol
      const usuario = await usuarios.findByPk(user.id, {
        attributes: [], // Sin atributos del usuario
        include: [
          {
            model: roles,
            attributes: ['rol'], // Solo incluir el nombre del rol
            include: []
          }
        ]
      });

      const token = jwt.sign({ id: user.id, role: usuario.role.rol }, keys.key, { expiresIn: "1h" });
      res.json({ message: usuario.role.rol, token });
    } else {
      res.status(401).json({ message: "Credenciales incorrectas" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};


// Decodificar token JWT y devolver json con el rol y permisos del usuario
usuariosController.getRolYPermisos = async (req, res) => {
  try {
    const token = req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : null;

    if (!token) {
      return res.status(403).json({ message: "No se proporcionó un token" });
    }

    const decoded = jwt.verify(token, keys.key);
    console.log(decoded);
    const usuario = await usuarios.findByPk(decoded.id, {
      attributes: [], // Sin atributos del usuario
      include: [
        {
          model: roles,
          attributes: ['rol'], // Solo incluir el nombre del rol
          include: [
            {
              model: rolesPermisos,
              include: [
                {
                  model: permisos,
                  attributes: ['permiso'] // Solo incluir el nombre del permiso
                }
              ]
            }
          ]
        }
      ]
    });
    
    // Construyendo la respuesta
    const response = {
      rol: usuario.role.rol,
      permisos: usuario.role.roles_permisos.map(rp => rp.permiso.permiso)
    };
    
    res.json(response); 
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el rol y permisos del usuario", error });
  }
};


// Restablecimiento de contraseña
usuariosController.resetPassword = async (req, res) => {
  const { email } = req.body;
  const usuario = await usuarios.findOne({ where: { email } });
  if (!usuario) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  const resetToken = jwt.sign({ id: usuario.id }, keys.key, { expiresIn: "1h" });

  // Configurar nodemailer para enviar el correo electrónico
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "johnwickleston@gmail.com",
      pass: "johnwickleston2014",
    },
  });

  const mailOptions = {
    from: "Administrador <noreply2@spb.gba.gov.ar>",
    to: email,
    subject: "Restablecer contraseña",
    text: `Para restablecer tu contraseña, haz click en el siguiente enlace: http://localhost:3000/api/v1/reset-password/${resetToken}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error al enviar el correo electrónico:", error);
    } else {
    console.log("Correo electrónico enviado:", info.response);
    }
  });

  res.json({ message: "Se ha enviado un correo electrónico para restablecer la contraseña" });
};

// Verificar token JWT
usuariosController.verifyToken = async (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: "No se proporcionó un token" });
  }

  try {
    const decoded = jwt.verify(token, keys.key);
    req.usuarioId = decoded.id;
    res.json({ message: "Token válido" });
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

module.exports = usuariosController;