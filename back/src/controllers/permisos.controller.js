const permisos = require('../models/permisos.model');

const permisosController = {};

// Crear un nuevo permiso
permisosController.createPermiso = async (req, res) => {
    try {
        const { permiso, description } = req.body;
        // Verificar si el permiso ya existe
        const permisoExistente = await permisos.findOne({ where: { permiso } });
        if (permisoExistente) {
            return res.status(409).json({ message: "El permiso ya existe" });
        }

        const nuevoPermiso = await permisos.create({ permiso, description });
        res.status(201).json(nuevoPermiso);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el permiso", error });
    }
};

// Obtener todos los permisos
permisosController.getAllPermisos = async (req, res) => {
    try {
        const todosLosPermisos = await permisos.findAll();
        res.status(200).json(todosLosPermisos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los permisos", error });
    }
};

// Obtener un permiso específico por ID
permisosController.getPermisoById = async (req, res) => {
    try {
        const { id } = req.params;
        const permiso = await permisos.findByPk(id);
        if (permiso) {
            res.status(200).json(permiso);
        } else {
            res.status(404).json({ message: "Permiso no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el permiso", error });
    }
};

// Actualizar un permiso
permisosController.updatePermiso = async (req, res) => {
    try {
        const { id } = req.params;
        const { permiso, description } = req.body;
        const permisoExistente = await permisos.findByPk(id);
        if (permisoExistente) {
            // Verificar si el permiso a actualizar ya existe
            const permisoExistente = await permisos.findOne({ where: { permiso, id: { [Op.ne]: id } } });
            if (permisoExistente) {
                return res.status(409).json({ message: "Ya existe otro permiso con el mismo nombre" });
            }

            permisoExistente.permiso = permiso ?? permisoExistente.permiso;
            permisoExistente.description = description ?? permisoExistente.description;
            await permisoExistente.save();
            res.status(200).json(permisoExistente);
        } else {
            res.status(404).json({ message: "Permiso no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el permiso", error });
    }
};

// Eliminar un permiso
permisosController.deletePermiso = async (req, res) => {
    try {
        const { id } = req.params;
        const permisoExistente = await permisos.findByPk(id);
        if (permisoExistente) {
            await permisoExistente.destroy();
            res.status(200).json({ message: "Permiso eliminado correctamente" });
        } else {
            res.status(404).json({ message: "Permiso no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el permiso", error });
    }
};


// Crear un permiso si no existe
permisosController.createPermisoIfNeeded = async (nombrePermiso, descripcion) => {
    const permisoExistente = await permisos.findOne({ where: { permiso: nombrePermiso } });
    if (!permisoExistente) {
      return await permisos.create({ permiso: nombrePermiso, description: descripcion });
    }
    return permisoExistente;
  };
  
  // Método de inicialización o configuración
  permisosController.initializePermisos = async () => {
    try {
      // Lista de permisos a crear
      const permisosParaCrear = [
        { nombre: 'CrearUsuario', descripcion: 'Permiso para crear nuevos usuarios' },
        { nombre: 'ModificarUsuario', descripcion: 'Permiso para modificar usuarios' },
        { nombre: 'EliminarUsuario', descripcion: 'Permiso para eliminar usuarios' },
        { nombre: 'CrearRol', descripcion: 'Permiso para crear nuevos roles' },
        { nombre: 'ModificarRol', descripcion: 'Permiso para modificar roles' },
        { nombre: 'EliminarRol', descripcion: 'Permiso para eliminar roles' },
        { nombre: 'CrearFabricante', descripcion: 'Permiso para crear nuevos fabricantes' },
        { nombre: 'ModificarFabricante', descripcion: 'Permiso para modificar fabricantes' },
        { nombre: 'EliminarFabricante', descripcion: 'Permiso para eliminar fabricantes' },
        { nombre: 'CrearPedido', descripcion: 'Permiso para crear nuevos pedidos' },
        { nombre: 'ModificarPedido', descripcion: 'Permiso para modificar pedidos' },
        { nombre: 'EliminarPedido', descripcion: 'Permiso para eliminar pedidos' },
        { nombre: 'CrearInsumo', descripcion: 'Permiso para crear nuevos insumos' },
        { nombre: 'ModificarInsumo', descripcion: 'Permiso para modificar insumos' },
        { nombre: 'EliminarInsumo', descripcion: 'Permiso para eliminar insumos' },
        { nombre: 'CrearPermiso', descripcion: 'Permiso para crear nuevos permisos' },
        { nombre: 'ModificarPermiso', descripcion: 'Permiso para modificar permisos' },
        { nombre: 'EliminarPermiso', descripcion: 'Permiso para eliminar permisos' },
        { nombre: 'CrearRolPermiso', descripcion: 'Permiso para crear nuevos roles_permisos' },
        { nombre: 'ModificarRolPermiso', descripcion: 'Permiso para modificar roles_permisos' },
        { nombre: 'EliminarRolPermiso', descripcion: 'Permiso para eliminar roles_permisos' },
        // Agregar más permisos según sea necesario
      ];
  
      for (const { nombre, descripcion } of permisosParaCrear) {
        await permisosController.createPermisoIfNeeded(nombre, descripcion);
      }
    } catch (error) {
      console.error("Error al inicializar permisos:", error);
    }
  };

module.exports = permisosController;