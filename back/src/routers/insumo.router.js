const insumoRouter = require("express").Router();
const Insumos = require("../models/insumo.model");
const insumosController = require("../controllers/insumos.controller");
const verifyToken = require("../middleware/auth").verifyToken;
const permisos = require('../permissions/permissions');
const { validacionesInsumos } = require('../validations/insumoValidations');

const permisoCrear = "crearInsumo"; // aca se define una constante con el nombre del controlador de la ruta, y se envia a permissions.js por parametro
const permisoActualizar = "actualizarInsumo";
const permisoObtenerTodos = "obtenerTodosLosInsumos";
const permisoObtenerPorID = "obtenerInsumoPorID";
const permisoEliminar = "eliminarInsumo";

/**
 * @swagger
 * /insumos/obtenerTodosLosInsumos:
 *   get:
 *     summary: Obtiene todos los insumos
 *     description: Devuelve un listado de todos los insumos registrados.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de insumos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor
 */
insumoRouter.get("/insumos/obtenerTodosLosInsumos", verifyToken, permisos.obtenerPermisos(permisoObtenerTodos), insumosController.obtenerTodosLosInsumos);

/**
 * @swagger
 * /insumos/obtenerInsumoPorID:
 *   get:
 *     summary: Obtiene un insumo por ID
 *     description: Devuelve los detalles de un insumo específico.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Detalles del insumo
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Insumo no encontrado
 *       500:
 *         description: Error en el servidor
 */
insumoRouter.get("/insumos/obtenerInsumoPorID", verifyToken, permisos.obtenerPermisos(permisoObtenerPorID), insumosController.obtenerInsumoPorID);

/**
 * @swagger
 * /insumos/crearInsumo:
 *   post:
 *     summary: Crea un nuevo insumo
 *     description: Registra un nuevo insumo en el sistema.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - insumo_name
 *               - price
 *               - is_stock
 *               - cantidad
 *               - tipo
 *             properties:
 *               insumo_name:
 *                 type: string
 *                 description: Nombre del insumo, debe ser alfanumérico y tener al menos 3 caracteres
 *               price:
 *                 type: number
 *                 description: Precio del insumo, debe ser numérico
 *               is_stock:
 *                 type: boolean
 *                 description: Indica si el insumo está en stock, debe ser numérico
 *               cantidad:
 *                 type: number
 *                 description: Cantidad disponible del insumo, debe ser numérico
 *               tipo:
 *                 type: string
 *                 description: Tipo de insumo, debe ser alfanumérico
 *     responses:
 *       201:
 *         description: Insumo creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 */
insumoRouter.post("/insumos/crearInsumo", verifyToken, permisos.obtenerPermisos(permisoCrear), validacionesInsumos, insumosController.crearInsumo);
 
/**
 * @swagger
 * /insumos/actualizarInsumo:
 *   put:
 *     summary: Actualiza un insumo
 *     description: Actualiza los detalles de un insumo existente.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Insumo'
 *     responses:
 *       200:
 *         description: Insumo actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Insumo no encontrado
 *       500:
 *         description: Error en el servidor
 */
insumoRouter.put("/insumos/actualizarInsumo", verifyToken, permisos.obtenerPermisos(permisoActualizar), insumosController.actualizarInsumo);

/**
 * @swagger
 * /insumos/eliminarInsumo:
 *   delete:
 *     summary: Elimina un insumo
 *     description: Elimina un insumo del sistema.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: insumo_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del insumo a eliminar
 *     responses:
 *       200:
 *         description: Insumo eliminado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Insumo no encontrado
 *       500:
 *         description: Error en el servidor
 */
insumoRouter.delete("/insumos/eliminarInsumo", verifyToken, permisos.obtenerPermisos(permisoEliminar), insumosController.eliminarInsumo)

module.exports = insumoRouter;