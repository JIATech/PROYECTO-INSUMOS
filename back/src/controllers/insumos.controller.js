const Insumos = require("../models/insumo.model");


/**
 * @swagger
 * /insumos/obtenerTodosLosInsumos:
 *   get:
 *     summary: Obtiene todos los insumos
 *     description: Devuelve una lista de todos los insumos registrados en el sistema.
 *     responses:
 *       200:
 *         description: Lista de insumos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Insumo'
 *       500:
 *         description: Error en el servidor
 */
async function obtenerTodosLosInsumos(req, res) {
    try {
        const insumos = await Insumos.findAll();
        res.status(200).json({
            ok: true,
            status: 200,
            body: insumos
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            status: 500,
            error: error.message
        });
    }
}

/**
 * @swagger
 * /insumos/crearInsumo:
 *   post:
 *     summary: Crea un nuevo insumo
 *     description: Registra un nuevo insumo en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Insumo'
 *     responses:
 *       201:
 *         description: Insumo creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error en el servidor
 */
async function crearInsumo(req, res) {
    try {
        const dataInsumos = req.body;
        await Insumos.sync();
        const createInsumo = await Insumos.create({
            insumo_name: dataInsumos.insumo_name,
            price: dataInsumos.price,
            is_stock: dataInsumos.is_stock,
            cantidad: dataInsumos.cantidad,
            tipo: dataInsumos.tipo
        });
        res.status(201).json({
            ok: true,
            status: 201,
            message: "Insumo cargado",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error al crear el insumo",
        });
    }
}


/**
 * @swagger
 * /insumos/obtenerInsumoPorID/{insumo_id}:
 *   get:
 *     summary: Obtiene un insumo por su ID
 *     description: Devuelve los detalles de un insumo específico basado en su ID.
 *     parameters:
 *       - in: path
 *         name: insumo_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del insumo
 *     responses:
 *       200:
 *         description: Detalles del insumo
 *       404:
 *         description: Insumo no encontrado
 *       500:
 *         description: Error en el servidor
 */
async function obtenerInsumoPorID(req, res) {
    try {
        const id = req.params.insumo_id;
        const insumo = await Insumos.findOne({
            where: {
                insumo_id: id,
            },
        });

        if (!insumo) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Insumo no encontrado",
            });
        }

        res.status(200).json({
            ok: true,
            status: 200,
            body: insumo,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error al obtener el insumo",
        });
    }
}

/**
 * @swagger
 * /insumos/actualizarInsumo:
 *   put:
 *     summary: Actualiza un insumo
 *     description: Actualiza los detalles de un insumo existente en el sistema.
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
async function actualizarInsumo(req, res) {
    try {
        const id = req.params.insumo_id;
        const dataInsumos = req.body;

        const [updateCount] = await Insumos.update(
            {
                insumo_name: dataInsumos.insumo_name,
                price: dataInsumos.price,
                is_stock: dataInsumos.is_stock,
                cantidad: dataInsumos.cantidad,
                tipo: dataInsumos.tipo
            },
            {
                where: {
                    insumo_id: id,
                },
            }
        );

        if (updateCount === 0) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Insumo no encontrado",
            });
        }

        res.status(200).json({
            ok: true,
            status: 200,
            message: "Insumo actualizado correctamente",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error al actualizar el insumo",
        });
    }
}

/**
 * @swagger
 * /insumos/eliminarInsumo/{insumo_id}:
 *   delete:
 *     summary: Elimina un insumo
 *     description: Elimina un insumo del sistema basado en su ID.
 *     parameters:
 *       - in: path
 *         name: insumo_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del insumo a eliminar
 *     responses:
 *       200:
 *         description: Insumo eliminado exitosamente
 *       404:
 *         description: Insumo no encontrado
 *       500:
 *         description: Error en el servidor
 */
async function eliminarInsumo(req, res) {
    try {
        const id = req.params.insumo_id_id;

        const deleteCount = await Insumos.destroy({
            where: {
                insumo_id: id,
            },
        });

        if (deleteCount === 0) {
            return res.status(404).json({
                ok: false,
                status: 404,
                message: "Insumo no encontrado",
            });
        }

        res.status(204).json({
            ok: true,
            status: 204,
            message: "Insumo eliminado correctamente",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            ok: false,
            status: 500,
            message: "Error al eliminar el insumo",
        });
    }
}



module.exports = {
    obtenerTodosLosInsumos,
    crearInsumo,
    obtenerInsumoPorID,
    actualizarInsumo,
    eliminarInsumo
};

