const insumoRouter = require("express").Router();
const insumosController = require("../controllers/insumos.controller");
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const { validacionesInsumos } = require('../validations/insumoValidations');


insumoRouter.get("/obtenerTodosLosInsumos", authenticate, insumosController.getAllInsumos);

insumoRouter.get("/obtenerInsumoPorID", authenticate, insumosController.getInsumoById);

insumoRouter.get("/buscarInsumo", authenticate, insumosController.searchInsumo);

insumoRouter.post("/crearInsumo", authenticate, authorize('CrearInsumo'), validacionesInsumos, insumosController.createInsumo);

insumoRouter.put("/actualizarInsumo", authenticate, authorize('ModificarInsumo'), insumosController.updateInsumo);

insumoRouter.delete("/eliminarInsumo", authenticate, authorize('EliminarInsumo'), insumosController.deleteInsumo);

module.exports = insumoRouter;