const roles_permisos = require('../models/roles_permisos.model');
const roles = require('../models/roles.model');
const permisos = require('../models/permisos.model');

const rolesPermisosController = {};

// Asociar un permiso a un rol
rolesPermisosController.addPermisoToRol = async (req, res) => {
    try {
        const { rolesId, permisosId } = req.body;

        // Verificar si el rol y el permiso existen
        const rolExistente = await roles.findByPk(rolesId);
        const permisoExistente = await permisos.findByPk(permisosId);
        if (!rolExistente || !permisoExistente) {
            return res.status(404).json({ message: "Rol o permiso no encontrado" });
        }

        // Verificar si la asociación ya existe
        const asociacionExistente = await roles_permisos.findOne({ where: { rolesId, permisosId } });
        if (asociacionExistente) {
            return res.status(409).json({ message: "El permiso ya esta asignado a este rol" });
        }

        const nuevaAsociacion = await roles_permisos.create({ rolesId, permisosId });
        res.status(201).json(nuevaAsociacion);
    } catch (error) {
        res.status(500).json({ message: "Error al asociar el permiso al rol", error });
    }
};

// Desasociar un permiso de un rol
rolesPermisosController.removePermisoFromRol = async (req, res) => {
    try {
        const { rolesId, permisosId } = req.body;
        const resultado = await roles_permisos.destroy({
            where: { rolesId, permisosId }
        });
        if (resultado) {
            res.status(200).json({ message: "Permiso desasociado del rol" });
        } else {
            res.status(404).json({ message: "Asociación no encontrada" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al desasociar el permiso del rol", error });
    }
};

// Obtener todos los permisos de un rol específico
rolesPermisosController.getPermisosByRolId = async (req, res) => {
    try {
        const { rolesId } = req.params;
        const permisos = await roles_permisos.findAll({
            where: { rolesId },
            include: permisos
        });
        res.status(200).json(permisos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los permisos del rol", error });
    }
};

module.exports = rolesPermisosController;