const { Model } = require("sequelize");
const sequelize = require('../connection/database');

class pedidos_insumos extends Model {}
pedidos_insumos.init({
  // Los campos id, pedidoId y insumoId son manejados internamente por Sequelize.
}, { sequelize, modelName: 'pedidos_insumos' });

module.exports = pedidos_insumos;