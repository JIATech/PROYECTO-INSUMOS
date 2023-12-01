const fabricantes = require('../models/fabricantes.model');

const fabricantesController = {};

// Crear un nuevo fabricante
fabricantesController.createFabricante = async (req, res) => {
  try {
    const { nombre, cuit, empresa } = req.body;
    // Verificar si ya existe un fabricante con el mismo CUIT
    const fabricanteExistente = await fabricantes.findOne({ where: { cuit } });
    if (fabricanteExistente) {
      return res.status(409).json({ message: "El fabricante ya existe" });
    }

    const nuevoFabricante = await fabricantes.create({ nombre, cuit, empresa });
    res.status(201).json(nuevoFabricante);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el fabricante", error });
  }
};

// Obtener todos los fabricantes
fabricantesController.getAllFabricantes = async (req, res) => {
  try {
    const todosLosFabricantes = await fabricantes.findAll();
    res.status(200).json(todosLosFabricantes);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los fabricantes", error });
  }
};

// Obtener un fabricante específico por ID
fabricantesController.getFabricanteById = async (req, res) => {
  try {
    const { id } = req.params;
    const fabricante = await fabricantes.findByPk(id);
    if (fabricante) {
      res.status(200).json(fabricante);
    } else {
      res.status(404).json({ message: "Fabricante no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el fabricante", error });
  }
};

// Actualizar un fabricante
fabricantesController.updateFabricante = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, cuit, empresa } = req.body;
    const fabricante = await fabricantes.findByPk(id);
    if (fabricante) {
      // Verificar si el CUIT a actualizar ya pertenece a otro fabricante
      const cuitExistente = await fabricantes.findOne({ where: { cuit, id: { [Op.ne]: id } } });
      if (cuitExistente) {
        return res.status(409).json({ message: "Ya existe otro fabricante con el mismo CUIT" });
      }

      fabricante.nombre = nombre ?? fabricante.nombre;
      fabricante.cuit = cuit ?? fabricante.cuit;
      fabricante.empresa = empresa ?? fabricante.empresa;
      await fabricante.save();
      res.status(200).json(fabricante);
    } else {
      res.status(404).json({ message: "Fabricante no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el fabricante", error });
  }
};

// Eliminar un fabricante
fabricantesController.deleteFabricante = async (req, res) => {
  try {
    const { id } = req.params;
    const fabricante = await fabricantes.findByPk(id);
    if (fabricante) {
      await fabricante.destroy();
      res.status(200).json({ message: "Fabricante eliminado" });
    } else {
      res.status(404).json({ message: "Fabricante no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el fabricante", error });
  }
};

module.exports = fabricantesController;
