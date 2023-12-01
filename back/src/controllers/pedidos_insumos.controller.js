const pedidos_insumos = require("../models/pedidos_insumos.model");
const pedidos = require("../models/pedidos.model");
const insumos = require("../models/insumos.model");


const pedidosInsumosController = {};

// Asociar un insumo a un pedido
pedidosInsumosController.addInsumoToPedido = async (req, res) => {
  try {
    const { pedidosId, insumosId } = req.body;

    // Verificar si el pedido y el insumo existen
    const pedidoExistente = await pedidos.findByPk(pedidosId);
    const insumoExistente = await insumos.findByPk(insumosId);
    if (!pedidoExistente || !insumoExistente) {
      return res.status(404).json({ message: "Pedido o insumo no encontrado" });
    }

    const nuevoPedidoInsumo = await pedidos_insumos.create({ pedidosId, insumosId });
    res.status(201).json(nuevoPedidoInsumo);
  } catch (error) {
    res.status(500).json({ message: "Error al asociar el insumo al pedido", error });
  }
};

// Desasociar un insumo de un pedido
pedidosInsumosController.removeInsumoFromPedido = async (req, res) => {
  try {
    const { pedidosId, insumosId } = req.body;
    const resultado = await pedidos_insumos.destroy({
      where: { pedidosId, insumosId }
    });
    if (resultado) {
      res.status(200).json({ message: "Insumo desasociado del pedido" });
    } else {
      res.status(404).json({ message: "Asociación no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al desasociar el insumo del pedido", error });
  }
};

// Obtener todos los insumos de un pedido específico
pedidosInsumosController.getInsumosByPedidoId = async (req, res) => {
  try {
    const { pedidosId } = req.params;
    const insumos = await pedidos_insumos.findAll({
      where: { pedidosId },
      include: insumos
    });
    res.status(200).json(insumos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los insumos del pedido", error });
  }
};

module.exports = pedidosInsumosController;