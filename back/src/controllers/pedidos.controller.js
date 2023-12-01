const pedidos = require('../models/pedidos.model');

// Define el objeto controlador
const pedidosController = {};

// Obtener todos los pedidos
pedidosController.getAllPedidos = async (req, res) => {
  try {
    const todosLosPedidos = await pedidos.findAll();
    res.status(200).json(todosLosPedidos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los pedidos", error });
  }
};

// Obtener un pedido por ID
pedidosController.getPedidoById = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await pedidos.findByPk(id);
    if (pedido) {
      res.status(200).json(pedido);
    } else {
      res.status(404).json({ message: "Pedido no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el pedido", error });
  }
};

// Crear un nuevo pedido
pedidosController.createPedido = async (req, res) => {
  try {
    const { cantidad, fechaPedido, estado } = req.body;
    const nuevoPedido = await pedidos.create({ cantidad, fechaPedido, estado });
    res.status(201).json(nuevoPedido);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el pedido", error });
  }
};

// Actualizar un pedido
pedidosController.updatePedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { cantidad, fechaPedido, estado } = req.body;
    const pedido = await pedidos.findByPk(id);
    if (pedido) {
      pedido.cantidad = cantidad ?? pedido.cantidad;
      pedido.fechaPedido = fechaPedido ?? pedido.fechaPedido;
      pedido.estado = estado ?? pedido.estado;
      await pedido.save();
      res.status(200).json(pedido);
    } else {
      res.status(404).json({ message: "Pedido no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el pedido", error });
  }
};

// Eliminar un pedido
pedidosController.deletePedido = async (req, res) => {
  try {
    const { id } = req.params;
    const pedido = await pedidos.findByPk(id);
    if (pedido) {
      await pedido.destroy();
      res.status(200).json({ message: "Pedido eliminado" });
    } else {
      res.status(404).json({ message: "Pedido no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el pedido", error });
  }
};

// Exportar el objeto controlador
module.exports = pedidosController;
