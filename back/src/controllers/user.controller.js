const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { Op } = require('sequelize');

const keys = require("../connection/keys");

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Inicio de sesión de usuario
 *     description: Permite a los usuarios iniciar sesión en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario o email
 *               - password
 *             properties:
 *               usuario:
 *                 type: string
 *                 description: El nombre de usuario para iniciar sesión
 *               email:
 *                 type: string
 *                 description: El email del usuario para iniciar sesión
 *               password:
 *                 type: string
 *                 description: La contraseña del usuario
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token de acceso generado para el usuario
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: Autenticación fallida
 */
async function login(req, res) {
  console.log("Credenciales recibidas:", req.body);
  const input = req.body.usuario;

  const usuariosBase = await User.findAll({
    where: {
      [Op.or]: [
        { email: input }, // Buscar por correo electrónico
        { usuario: input } // Buscar por nombre de usuario
      ]
    },
  });

  if (usuariosBase.length > 0) {
    const usuarioBase = usuariosBase[0];
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      usuarioBase.password
    );

    if (passwordMatch) {
      const userId = usuarioBase.usuario_id;
      const payload = {
        userId: userId,
        check: true,
      };
      const token = jwt.sign(payload, keys.key, {
        expiresIn: "30m",
      });
      res.json({
        message: "Autenticación exitosa",
        success: true,
        token: token,
      });
    } else {
      res.json({
        message: "Contraseña incorrecta",
      });
    }
  } else {
    res.json({
      message: "Usuario o email no encontrado",
    });
  }
}

/**
 * @swagger
 * /usuarios/crearUsuario:
 *   post:
 *     summary: Crear un nuevo usuario
 *     description: Registra un nuevo usuario en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario
 *               - password
 *               - email
 *               - rol
 *             properties:
 *               usuario:
 *                 type: string
 *                 description: Nombre de usuario para el nuevo usuario
 *               password:
 *                 type: string
 *                 description: Contraseña para el nuevo usuario
 *               email:
 *                 type: string
 *                 description: Dirección de correo electrónico del usuario
 *               rol:
 *                 type: string
 *                 description: Rol del usuario en el sistema
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error en el servidor
 */
async function crearUsuario(req, res) {
  try {
    const dataUsuarios = req.body;
    const rolCliente = 2;
    // Verificar si el usuario o el email ya existe
    const usuarioOEmailExistente = await User.findOne({
      where: {
        [Op.or]: [
          { usuario: dataUsuarios.usuario },
          { email: dataUsuarios.email }
        ]
      }
    });

    if (usuarioOEmailExistente) {
      return res.status(409).json({
        ok: false,
        status: 409,
        message: "El usuario o el email ya existe",
      });
    } else {
      const hashedPassword = await bcrypt.hash(dataUsuarios.password, 8);

      await User.sync();

      await User.create({
        usuario: dataUsuarios.usuario,
        password: hashedPassword,
        email: dataUsuarios.email,
        rol: rolCliente,
      });

      res.status(201).json({
        ok: true,
        status: 201,
        message: "User cargado",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al crear el usuario",
    });
  }
}

/**
 * @swagger
 * /usuarios/obtenerUsuarioPorID/{usuario_id}:
 *   get:
 *     summary: Obtiene un usuario por su ID
 *     description: Devuelve los detalles de un usuario específico basado en su ID.
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del usuario
 *     responses:
 *       200:
 *         description: Detalles del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
async function obtenerUsuarioPorID(req, res) {
  try {
    const id = req.params.usuario_id;
    const usuario = await User.findOne({
      where: {
        usuario_id: id,
      },
    });

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "User no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      status: 200,
      body: usuario,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al obtener el usuario",
    });
  }
}

/**
 * @swagger
 * /usuarios/obtenerTodosLosUsuarios:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     description: Devuelve una lista de todos los usuarios registrados en el sistema.
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Usuario'
 *       500:
 *         description: Error en el servidor
 */
async function obtenerTodosLosUsuarios(req, res) {
  const userId = req.userId;
  try {
    const usuarios = await User.findAll();

    res.status(200).json({
      ok: true,
      status: 200,
      body: usuarios,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al obtener todos los usuarios",
    });
  }
}
// actualiza usuario propio de quien loguea luego agregar para un admin que modifique todos

/**
 * @swagger
 * /usuarios/actualizarUsuario:
 *   put:
 *     summary: Actualiza un usuario
 *     description: Actualiza los detalles de un usuario existente en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *             properties:
 *               usuario_id:
 *                 type: integer
 *                 description: ID del usuario a actualizar
 *               usuario:
 *                 type: string
 *                 description: Nombre de usuario actualizado
 *               password:
 *                 type: string
 *                 description: Contraseña actualizada
 *               email:
 *                 type: string
 *                 description: Email actualizado
 *               rol:
 *                 type: string
 *                 description: Rol actualizado
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
async function actualizarUsuario(req, res) {
  const userId = req.userId; // Obten el ID del usuario autenticado desde el token
  console.log(userId);
  const dataUsuarios = req.body;
  const hashedPassword = await bcrypt.hash(dataUsuarios.password, 8);

  try {
    const [updateCount] = await User.update(
      {
        usuario: dataUsuarios.usuario,
        password: hashedPassword,
        email: dataUsuarios.email,
        rol: dataUsuarios.rol,
      },
      {
        where: {
          usuario_id: userId, // Utiliza el ID del usuario del token
        },
      }
    );

    if (updateCount === 0) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "User no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      status: 200,
      message: "User actualizado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al actualizar el usuario",
    });
  }
}

/**
 * @swagger
 * /usuarios/actualizarUsuarioPorID/{usuario_id}:
 *   put:
 *     summary: Actualiza un usuario por su ID
 *     description: Actualiza los detalles de un usuario específico basado en su ID.
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *                 description: Nombre de usuario actualizado
 *               password:
 *                 type: string
 *                 description: Contraseña actualizada
 *               email:
 *                 type: string
 *                 description: Email actualizado
 *               rol:
 *                 type: string
 *                 description: Rol actualizado
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
async function actualizarUsuarioPorID(req, res) {
  const dataUsuarios = req.body;
  const hashedPassword = await bcrypt.hash(dataUsuarios.password, 8);

  try {
    const [updateCount] = await User.update(
      {
        usuario_id: dataUsuarios.usuario_id,
        usuario: dataUsuarios.usuario,
        password: hashedPassword,
        email: dataUsuarios.email,
        rol: dataUsuarios.rol,
      },
      {
        where: {
          usuario_id: dataUsuarios.usuario_id,
        },
      }
    );

    if (updateCount === 0) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "User no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      status: 200,
      message: "User actualizado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al actualizar el usuario",
    });
  }
}

/**
 * @swagger
 * /usuarios/eliminarUsuario:
 *   delete:
 *     summary: Elimina un usuario
 *     description: Elimina un usuario del sistema.
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a eliminar
 *     responses:
 *       204:
 *         description: Usuario eliminado correctamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
async function eliminarUsuario(req, res) {
  try {
    const id = req.params.usuario_id;

    const deleteCount = await User.destroy({
      where: {
        usuario_id: id,
      },
    });

    if (deleteCount === 0) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "User no encontrado",
      });
    }

    res.status(204).json({
      ok: true,
      status: 204,
      message: "User eliminado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al eliminar el usuario",
    });
  }
}

//funcion enviar email para restaurar pass
function iniciarTransporter () {
  return nodemailer.createTransport({
    service: 'smtp',
    port: 25,
    host: '172.16.1.203',
    tls: {
      rejectUnauthorized: false
    }
  })
}


function enviarEmail(email, token){
  const transporter = iniciarTransporter();

  const link = `http://localhost:3000/api/v1/reestablecerPass/${token}`;
  const mailOptions = {
    from: '"Contadurias Prueba" <noreply2@spb.gba.gov.ar>',
    to: email,
    subject: 'Reestablecer contraseña',
    text: link
  }
  
  
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo electrónico:', error);
    } else {
      console.log('Correo electrónico enviado:', info.response);
    }
  });
  
}


// controlador para generar token y reestablecer contraseña
async function enviarToken(req, res, next) {
  const emailBody = req.body.email;
  let usuario = "";

  try {
    usuario = await User.findOne({
      where: {
        email: emailBody,
      },
    }); 
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al obtener el email",
    });
  }

  // Genera el token
  if (!usuario) {
    return res.status(404).json({
      ok: false,
      message: "User no encontrado",
    });
  }else{
    const userId = usuario.usuario_id;
    const payload = {
      userId: userId,
      check: true,
    };
    const token = jwt.sign(payload, keys.key, {
      expiresIn: "30m",
    });
    enviarEmail(emailBody, token)
  
    res.json({
      message: "Se le ha enviado un email con un link para restaurar la contraseña",
      success: true
    });

  }
 
}

/**
 * @swagger
 * /usuarios/actualizarPass:
 *   put:
 *     summary: Actualiza la contraseña de un usuario
 *     description: Permite a un usuario actualizar su contraseña.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - usuario_id
 *               - passwordActual
 *               - passwordNuevo
 *             properties:
 *               usuario_id:
 *                 type: integer
 *                 description: ID del usuario que actualiza su contraseña
 *               passwordActual:
 *                 type: string
 *                 description: Contraseña actual del usuario
 *               passwordNuevo:
 *                 type: string
 *                 description: Nueva contraseña del usuario
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
async function actualizarPass(req, res) {
  const nuevaPassword = req.body.password;
  const hashedPassword = await bcrypt.hash(nuevaPassword, 8);
  const userId = req.userId;
  // Busca al usuario por el token
  const usuario = await User.findOne({
    where: {
      usuario_id: userId,
    },
  });

  if (!usuario) {
    return res.redirect("/api/v1/reestablecer");
  }

  try {
    // Actualiza la contraseña del usuario en la base de datos
    await User.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          usuario_id: userId,
        },
      }
    );

    res.status(201).json({
      ok: true,
      message: "Contraseña actualizada con éxito",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al actualizar la contraseña",
    });
  }
}

module.exports = {
  crearUsuario,
  obtenerUsuarioPorID,
  obtenerTodosLosUsuarios,
  actualizarUsuario,
  actualizarUsuarioPorID,
  eliminarUsuario,
  login,
  enviarToken,
  actualizarPass,
};
