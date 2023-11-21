const Fabricantes = require("../models/fabricante.model");
const express = require("express");
const app = express();

const keys = require("../connection/keys");
app.set("key", keys.key);

/**
 * @swagger
 * /fabricantes/crearFabricante:
 *   post:
 *     summary: Crea un nuevo fabricante
 *     description: Registra un nuevo fabricante en el sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Fabricante'
 *     responses:
 *       201:
 *         description: Fabricante creado exitosamente
 *       400:
 *         description: Datos de entrada inválidos
 *       500:
 *         description: Error en el servidor
 */
async function crearFabricante(req, res) {
  const dataFabricante = req.body;
  try {
    // se comprueba que no se carguen dos veces a un fabricante de la misma empresa
    const nombreExistente = await Fabricantes.findOne({
      where: { nombre: dataFabricante.nombre },
    });
    const empresaExistente = await Fabricantes.findOne({
      where: { empresa: dataFabricante.empresa },
    });

    if (nombreExistente && empresaExistente) {
      return res.status(409).json({
        ok: false,
        status: 409,
        message: "El fabricante ya existe",
      });
    } else {
      await Fabricantes.sync();
      const crearFabricante = await Fabricantes.create({
        id: dataFabricante.id,
        nombre: dataFabricante.nombre,
        cuit: dataFabricante.cuit,
        empresa: dataFabricante.empresa,
      });

      res.status(201).json({
        ok: true,
        status: 201,
        message: "Fabricante cargado",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al crear el fabricante",
    });
  }
}

/**
 * @swagger
 * /fabricantes/obtenerTodosLosFabricantes:
 *   get:
 *     summary: Obtiene todos los fabricantes
 *     description: Devuelve una lista de todos los fabricantes registrados en el sistema.
 *     responses:
 *       200:
 *         description: Lista de fabricantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Fabricante'
 *       500:
 *         description: Error en el servidor
 */
async function obtenerTodosLosFabricantes(req, res) {
  try {
    const fabricantes = await Fabricantes.findAll();
    res.status(200).json({
      ok: true,
      status: 200,
      body: fabricantes,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      error: error.message,
    });
  }
}

/**
 * @swagger
 * /fabricantes/actualizarFabricante/{id}:
 *   put:
 *     summary: Actualiza un fabricante
 *     description: Actualiza los detalles de un fabricante existente en el sistema.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del fabricante a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Fabricante'
 *     responses:
 *       200:
 *         description: Fabricante actualizado exitosamente
 *       404:
 *         description: Fabricante no encontrado
 *       500:
 *         description: Error en el servidor
 */
async function actualizarFabricante(req, res) {
  try {
    const id = req.params.id;
    const dataFabricante = req.body;

    const [updateCount] = await Fabricantes.update(
      {
        id: dataFabricante.id,
        nombre: dataFabricante.nombre,
        cuit: dataFabricante.cuit,
        empresa: dataFabricante.empresa,
      },
      {
        where: {
          id: id,
        },
      }
    );

    if (updateCount === 0) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "Fabricante no encontrado",
      });
    }

    res.status(200).json({
      ok: true,
      status: 200,
      message: "Fabricante actualizado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al actualizar el fabricante",
    });
  }
}

/**
 * @swagger
 * /fabricantes/eliminarFabricante/{id}:
 *   delete:
 *     summary: Elimina un fabricante
 *     description: Elimina un fabricante del sistema basado en su ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del fabricante a eliminar
 *     responses:
 *       204:
 *         description: Fabricante eliminado correctamente
 *       404:
 *         description: Fabricante no encontrado
 *       500:
 *         description: Error en el servidor
 */
async function eliminarFabricante(req, res) {
  try {
    const id = req.params.id;

    const eliminar = await Fabricantes.destroy({
      where: {
        id: id,
      },
    });

    if (eliminar === 0) {
      return res.status(404).json({
        ok: false,
        status: 404,
        message: "Fabricante no encontrado",
      });
    }

    res.status(204).json({
      ok: true,
      status: 204,
      message: "Fabricante eliminado correctamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      status: 500,
      message: "Error al eliminar el fabricante",
    });
  }
}

module.exports = {
  crearFabricante,
  obtenerTodosLosFabricantes,
  actualizarFabricante,
  eliminarFabricante,
};
