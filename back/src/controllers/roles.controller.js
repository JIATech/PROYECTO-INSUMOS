const roles = require('../models/roles.model');

const rolesController = {};

// Crear un nuevo rol
rolesController.createRole = async (req, res) => {
    try {
        const { rol, description } = req.body;
        // Verificar si el rol ya existe
        const rolExistente = await roles.findOne({ where: { rol } });
        if (rolExistente) {
            return res.status(409).json({ message: "El rol ya existe" });
        }

        const nuevoRol = await roles.create({ rol, description });
        res.status(201).json(nuevoRol);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el rol", error });
    }
};

// Obtener todos los roles
rolesController.getAllRoles = async (req, res) => {
    try {
        const todosLosRoles = await roles.findAll();
        res.status(200).json(todosLosRoles);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los roles", error });
    }
};

// Obtener un rol específico por ID
rolesController.getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const rol = await roles.findByPk(id);
        if (rol) {
            res.status(200).json(rol);
        } else {
            res.status(404).json({ message: "Rol no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el rol", error });
    }
};

// Actualizar un rol
rolesController.updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { rol, description } = req.body;
        const rolExistente = await roles.findByPk(id);
        if (rolExistente) {
            // Verificar si el rol a actualizar ya existe
            const rolExistente = await roles.findOne({ where: { rol, id: { [Op.ne]: id } } });
            if (rolExistente) {
                return res.status(409).json({ message: "Ya existe otro rol con el mismo nombre" });
            }

            rolExistente.rol = rol ?? rolExistente.rol;
            rolExistente.description = description ?? rolExistente.description;
            await rolExistente.save();
            res.status(200).json(rolExistente);
        } else {
            res.status(404).json({ message: "Rol no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el rol", error });
    }
};

// Eliminar un rol
rolesController.deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const rolExistente = await roles.findByPk(id);
        if (rolExistente) {
            await rolExistente.destroy();
            res.status(200).json({ message: "Rol eliminado" });
        } else {
            res.status(404).json({ message: "Rol no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el rol", error });
    }
};

module.exports = rolesController;