
const { Model } = require('sequelize');
const sequelize = require('../connection/database');

class roles_permisos extends Model {}
roles_permisos.init({
  // Los campos id, rolesId y permisosId son manejados internamente por Sequelize.
}, { sequelize, modelName: 'roles_permisos' });

module.exports = roles_permisos;
