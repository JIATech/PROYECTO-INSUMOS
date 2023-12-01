const fabricantesController = require("../controllers/fabricantes.controller")
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const fabricanteRouter = require("express").Router()
const validacionesFabricantes = require('../validations/fabricanteValidations');


fabricanteRouter.post("/crearFabricante", authenticate, authorize('CrearFabricante'),  validacionesFabricantes.validacionesFabricantes, fabricantesController.createFabricante);


fabricanteRouter.put("/actualizarFabricante", authenticate, authorize('ModificarFabricante'), fabricantesController.updateFabricante);


fabricanteRouter.get("/obtenerTodosLosFabricante", authenticate, authorize('ModificarFabricante'), fabricantesController.getAllFabricantes);


fabricanteRouter.delete("/eliminarFabricante", authenticate, authorize('EliminarFabricante'), fabricantesController.deleteFabricante);


module.exports = fabricanteRouter;