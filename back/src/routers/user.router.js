const userRouter = require("express").Router();
const { faker } = require("@faker-js/faker");
const User = require("../models/user.model");
const userController = require('../controllers/user.controller'); 
const { request } = require("express");
const verifyToken = require("../middleware/auth").verifyToken;
const obtenerPermisos = require('../permissions/permissions');
const { validacionesInputs, validacionLogin } = require('../validations/userValidations');
const permisos = require('../permissions/permissions');
const { catchToken } = require("../middleware/token");
const checkToken = require("../middleware/auth").checkToken;

// se define una constante con el nombre del controlador de la ruta y se envia a permissions.js por parametro
// a fin de saber que permiso tiene el usuario logueado:

const permisoCrear = "crearUsuario";
const permisoActualizar = "actualizarUsuario";
const permisoActualizarPorID = "actualizarUsuarioPorID";
const permisoObtenerTodos = "obtenerTodosLosUsuarios";
const permisoObtenerPorID = "obtenerUsuarioPorID";
const permisoEliminar = "eliminarUsuario";


// RUTAS:

/**
 * @swagger
 * /usuarios/obtenerTodosLosUsuarios:
 *   get:
 *     summary: Obtiene todos los usuarios
 *     description: Devuelve un listado de todos los usuarios registrados.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
userRouter.get("/usuarios/obtenerTodosLosUsuarios", verifyToken, permisos.obtenerPermisos(permisoObtenerTodos), userController.obtenerTodosLosUsuarios);

/**
 * @swagger
 * /usuarios/obtenerUsuarioPorID:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     description: Devuelve los detalles de un usuario específico.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Detalles del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
userRouter.get("/usuarios/obtenerUsuarioPorID",  verifyToken, permisos.obtenerPermisos(permisoObtenerPorID), userController.obtenerUsuarioPorID);

/**
 * @swagger
 * /usuarios/crearUsuario:
 *   post:
 *     summary: Crea un nuevo usuario
 *     description: Añade un nuevo usuario al sistema.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Usuario creado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
userRouter.post("/usuarios/crearUsuario", verifyToken, permisos.obtenerPermisos(permisoCrear), validacionesInputs, userController.crearUsuario);

/**
 * @swagger
 * /usuarios/actualizarUsuario:
 *   put:
 *     summary: Actualiza un usuario
 *     description: Actualiza los datos de un usuario existente.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
userRouter.put("/usuarios/actualizarUsuario", verifyToken, permisos.obtenerPermisos(permisoActualizar), userController.actualizarUsuario);

/**
 * @swagger
 * /usuarios/actualizarUsuarioPorID:
 *   put:
 *     summary: Actualiza un usuario específico por ID
 *     description: Actualiza los datos de un usuario basado en su ID.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario actualizado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
userRouter.put("/usuarios/actualizarUsuarioPorID", verifyToken, permisos.obtenerPermisos(permisoActualizarPorID), userController.actualizarUsuarioPorID);

/**
 * @swagger
 * /usuarios/eliminarUsuario:
 *   delete:
 *     summary: Elimina un usuario
 *     description: Elimina un usuario de la base de datos.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error en el servidor
 */
userRouter.delete("/usuarios/eliminarUsuario", verifyToken, permisos.obtenerPermisos(permisoEliminar), userController.eliminarUsuario);

/**
 * @swagger
 * /usuarios/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Permite a un usuario iniciar sesión en el sistema.
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
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error en el servidor
 */
userRouter.post("/login", validacionLogin, userController.login);

userRouter.post('/reestablecer', userController.enviarToken);

userRouter.post("/reestablecerPass/:token", catchToken, userController.actualizarPass);

userRouter.post('/refreshToken', checkToken, (req, res) => {
    if (req.isTokenValid) {
        // El token es válido, emitir un nuevo token
        const newToken = jwt.sign({ userId: req.userId }, 'clavesecreta', { expiresIn: '30m' });
        res.json({ newToken });
    } else {
        // Token inválido o no proporcionado, manejar según sea necesario
        res.status(401).json({ message: 'Token no válido o expirado' });
    }
});

module.exports = userRouter; 