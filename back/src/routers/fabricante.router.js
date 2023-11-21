const fabricanteRouter = require("express").Router()
const fabricantesController = require("../controllers/fabricantes.controller")
const verifyToken = require("../middleware/auth").verifyToken;
const app = require("../app/app");
const { request } = require("express");
const { permissionsFabricantes } = require('../permissions/permissionsFabricantes');
const validacionesFabricantes = require('../validations/fabricanteValidations');

/**
 * @swagger
 * /fabricantes/crearFabricante:
 *   post:
 *     summary: Crea un nuevo fabricante
 *     description: Registra un nuevo fabricante en el sistema.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - cuit
 *               - empresa
 *             properties:
 *               nombre:
 *                 type: string
 *                 description: Nombre del fabricante, alfanumérico y con al menos 3 caracteres
 *               cuit:
 *                 type: string
 *                 description: CUIT del fabricante, alfanumérico
 *               empresa:
 *                 type: string
 *                 description: Nombre de la empresa del fabricante, alfanumérico
 *     responses:
 *       201:
 *         description: Fabricante creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 */
fabricanteRouter.post("/fabricantes/crearFabricante", verifyToken, permissionsFabricantes(),  validacionesFabricantes.validacionesFabricantes, fabricantesController.crearFabricante);

/**
 * @swagger
 * /fabricantes/actualizarFabricante:
 *   put:
 *     summary: Actualiza un fabricante
 *     description: Actualiza los detalles de un fabricante existente.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Fabricante'
 *     responses:
 *       200:
 *         description: Fabricante actualizado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Fabricante no encontrado
 *       500:
 *         description: Error en el servidor
 */
fabricanteRouter.put("/fabricantes/actualizarFabricante", verifyToken, permissionsFabricantes(), fabricantesController.actualizarFabricante);

/**
 * @swagger
 * /fabricantes/obtenerTodosLosFabricantes:
 *   get:
 *     summary: Obtiene todos los fabricantes
 *     description: Devuelve una lista de todos los fabricantes registrados.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de fabricantes
 *       500:
 *         description: Error en el servidor
 */
fabricanteRouter.get("/fabricantes/obtenerTodosLosFabricante", verifyToken, permissionsFabricantes(), fabricantesController.obtenerTodosLosFabricantes);
 
/**
 * @swagger
 * /fabricantes/eliminarFabricante:
 *   delete:
 *     summary: Elimina un fabricante
 *     description: Elimina un fabricante del sistema.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: fabricante_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del fabricante a eliminar
 *     responses:
 *       200:
 *         description: Fabricante eliminado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Fabricante no encontrado
 *       500:
 *         description: Error en el servidor
 */
fabricanteRouter.delete("/fabricantes/eliminarFabricante", verifyToken, permissionsFabricantes(), fabricantesController.eliminarFabricante);


module.exports = fabricanteRouter;