const usuariosController = require('../controllers/usuarios.controller');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { validacionesInputs, validacionLogin } = require('../validations/userValidations');
const userRouter = require("express").Router();


// Define routes for users
userRouter.get('/obtenerTodosLosUsuarios', authenticate, usuariosController.getAllUsuarios);
userRouter.get('/obtenerUsuarioPorID/:id', usuariosController.getUsuarioById);
userRouter.post('/crearUsuario', authenticate, authorize('CrearUsuario'), validacionesInputs, usuariosController.createUsuario);
userRouter.put('/actualizarUsuarioPorID/:id', authenticate, authorize('ModificarUsuario'), usuariosController.updateUsuario);
userRouter.delete('/eliminarUsuario/:id', authenticate, authorize('EliminarUsuario'), usuariosController.deleteUsuario);
userRouter.post("/login", validacionLogin, usuariosController.login);
userRouter.post('/resetPassword', usuariosController.resetPassword);


module.exports = userRouter;