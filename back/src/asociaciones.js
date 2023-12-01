// asociaciones.js
const usuarios = require('./models/usuarios.model');
const roles = require('./models/roles.model');
const fabricantes = require('./models/fabricantes.model');
const pedidos = require('./models/pedidos.model');
const insumos = require('./models/insumos.model');
const pedidos_insumos = require('./models/pedidos_insumos.model');
const permisos = require('./models/permisos.model');
const roles_permisos = require('./models/roles_permisos.model');

// Asociaciones
usuarios.belongsTo(roles, { foreignKey: 'rolesId' });
roles.hasMany(usuarios, { foreignKey: 'rolesId' });

fabricantes.belongsTo(roles, { foreignKey: 'rolesId' });
roles.hasMany(fabricantes, { foreignKey: 'rolesId' });

pedidos.belongsTo(fabricantes, { foreignKey: 'fabricantesId' });
fabricantes.hasMany(pedidos, { foreignKey: 'fabricantesId' });

pedidos_insumos.belongsTo(pedidos, { foreignKey: 'pedidosId' });
pedidos.hasMany(pedidos_insumos, { foreignKey: 'pedidosId' });

pedidos_insumos.belongsTo(insumos, { foreignKey: 'insumosId' });
insumos.hasMany(pedidos_insumos, { foreignKey: 'insumosId' });

roles_permisos.belongsTo(roles, { foreignKey: 'rolesId' });
roles.hasMany(roles_permisos, { foreignKey: 'rolesId' });

roles_permisos.belongsTo(permisos, { foreignKey: 'permisosId' });
permisos.hasMany(roles_permisos, { foreignKey: 'permisosId' });

usuarios.belongsTo(fabricantes, { foreignKey: 'fabricantesId' });
fabricantes.hasMany(usuarios, { foreignKey: 'fabricantesId' });

module.exports = {
    usuarios,
    roles,
    fabricantes,
    pedidos,
    insumos,
    pedidos_insumos,
    permisos,
    roles_permisos,
    };