const insumos = require("../models/insumos.model");

const insumosController = {};

// Crear un nuevo insumo
insumosController.createInsumo = async (req, res) => {
  try {
    const { insumo, precio, stock } = req.body;
    const nuevoInsumo = await insumos.create({ insumo, precio, stock });
    res.status(201).json(nuevoInsumo);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el insumo", error });
  }
};

// Obtener todos los insumos
insumosController.getAllInsumos = async (req, res) => {
  try {
    const todosLosInsumos = await insumos.findAll();
    res.status(200).json(todosLosInsumos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los insumos", error });
  }
};

// Obtener un insumo específico por ID
insumosController.getInsumoById = async (req, res) => {
  try {
    const { id } = req.params;
    const insumo = await insumos.findByPk(id);
    if (insumo) {
      res.status(200).json(insumo);
    } else {
      res.status(404).json({ message: "Insumo no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el insumo", error });
  }
};

// Actualizar un insumo
insumosController.updateInsumo = async (req, res) => {
  try {
    const { id } = req.params;
    const { insumo, precio, stock } = req.body;
    const insumoExistente = await insumos.findByPk(id);
    if (insumoExistente) {
      insumoExistente.insumo = insumo ?? insumoExistente.insumo;
      insumoExistente.precio = precio ?? insumoExistente.precio;
      insumoExistente.stock = stock ?? insumoExistente.stock;
      await insumoExistente.save();
      res.status(200).json(insumoExistente);
    } else {
      res.status(404).json({ message: "Insumo no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el insumo", error });
  }
};

// Eliminar un insumo
insumosController.deleteInsumo = async (req, res) => {
  try {
    const { id } = req.params;
    const insumo = await insumos.findByPk(id);
    if (insumo) {
      await insumo.destroy();
      res.status(200).json({ message: "Insumo eliminado" });
    } else {
      res.status(404).json({ message: "Insumo no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el insumo", error });
  }
};

module.exports = insumosController;