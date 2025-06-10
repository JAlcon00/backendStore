import { Request, Response, NextFunction } from "express";
import * as usuarioService from "../services/usuarioService";
import { encryptData, decryptData } from '../utils/crypto';
import logger from '../utils/logger';

// Crear un nuevo usuario
export const crearUsuario = async (req: Request, res: Response) => {
    try {
        const { nombre, password, rol } = req.body;
        const usuario = await usuarioService.crearUsuario({ nombre, password, rol });
        const { password: _, ...usuarioSinPassword } = usuario;
        res.status(201).json({ user: usuarioSinPassword });
        logger.info(`✅ Usuario registrado exitosamente - ID: ${usuario._id}`);
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "El nombre ya está registrado"
        ) {
            logger.warn('Nombre ya registrado');
            res.status(400).json({ message: error.message });
        } else {
            logger.error('Error al crear usuario:', error);
            res.status(500).json({ message: "Error al crear el usuario", error });
        }
    }
};

// Obtener todos los usuarios
export const obtenerUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await usuarioService.obtenerUsuarios();
    const usuariosSinPassword = usuarios.map(({ password, ...rest }) => rest);
    res.status(200).json(usuariosSinPassword);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios", error });
  }
};

// Obtener un usuario por ID
export const obtenerUsuariobyId = async (req: Request, res: Response) => {
  try {
    const usuario = await usuarioService.obtenerUsuariobyId(req.params.id);
    if (usuario) {
      // Eliminar password de la respuesta
      const { password, ...rest } = usuario;
      res.status(200).json(rest);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    if (error instanceof Error && error.message === "ID de usuario inválido") {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Error al obtener el usuario", error });
    }
  }
};

// Actualizar un usuario
export const actualizarUsuario = async (req: Request, res: Response) => {
  try {
    const actualizado = await usuarioService.actualizarUsuario(req.params.id, req.body);
    if (actualizado) {
      const usuario = await usuarioService.obtenerUsuariobyId(req.params.id);
      const { password, ...usuarioSinPassword } = usuario!;
      res.status(200).json(usuarioSinPassword);
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "El email ya está registrado"
    ) {
      res.status(400).json({ message: error.message });
    } else {
      res
        .status(500)
        .json({ message: "Error al actualizar el usuario", error });
    }
  }
};

// Eliminar un usuario
export const eliminarUsuario = async (req: Request, res: Response) => {
  try {
    const eliminado = await usuarioService.eliminarUsuario(req.params.id);
    if (eliminado) {
      res.status(200).json({ message: "Usuario eliminado con éxito" });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario", error });
  }
};

// Obtener usuarios activos
export const obtenerUsuariosActivos = async (req: Request, res: Response) => {
  try {
    const usuarios = await usuarioService.obtenerUsuariosActivos();
    const usuariosSinPassword = usuarios.map(({ password, ...rest }) => rest);
    res.status(200).json(usuariosSinPassword);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios activos", error });
  }
};

// Obtener usuarios inactivos
export const obtenerUsuariosInactivos = async (req: Request, res: Response) => {
  try {
    const usuarios = await usuarioService.obtenerUsuariosInactivos();
    const usuariosSinPassword = usuarios.map(({ password, ...rest }) => rest);
    res.status(200).json(usuariosSinPassword);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios inactivos", error });
  }
};

// Login de usuario con rate limiting
export const loginUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { nombre, password } = req.body;
    if (!nombre || !password) {
      res.status(400).json({ message: "Nombre de usuario y password son requeridos" });
      return;
    }
    // Buscar usuario
    const usuario = await usuarioService.loginUsuario(nombre, password);
    if (usuario) {
      // Eliminar password de la respuesta
      const { password, ...rest } = usuario;
      res.status(200).json({ user: rest });
    } else {
      res.status(401).json({ message: "Credenciales inválidas" });
    }
  } catch (error) {
    logger.error('Error en loginUsuario:', error);
    res.status(500).json({ message: "Error en el login", error });
  }
};

// Cambiar contraseña
export const cambiarPassword = async (req: Request, res: Response) => {
  try {
    const { nuevaPassword } = req.body;
    if (!nuevaPassword) {
      res.status(400).json({ message: "Nueva contraseña es requerida" });
      return;
    }

    const actualizado = await usuarioService.cambiarPassword(
      req.params.id,
      nuevaPassword
    );
    if (actualizado) {
      res.status(200).json({ message: "Contraseña actualizada con éxito" });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al cambiar la contraseña", error });
  }
};

// Buscar usuarios por rol
export const buscarUsuariosPorRol = async (req: Request, res: Response) => {
  try {
    const rol = req.params.rol as "cliente" | "admin";
    if (!["cliente", "admin"].includes(rol)) {
      res.status(400).json({ message: "Rol inválido" });
      return;
    }

    const usuarios = await usuarioService.buscarUsuariosPorRol(rol);
    const usuariosSinPassword = usuarios.map(({ password, ...rest }) => rest);
    res.status(200).json(usuariosSinPassword);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar usuarios por rol", error });
  }
};

// Buscar usuarios por nombre
export const buscarUsuariosPorNombre = async (req: Request, res: Response) => {
  try {
    const nombre = req.query.nombre as string;
    
    if (!nombre) {
      res.status(400).json({ message: "Nombre es requerido" });
      return;
    }
    

    const usuarios = await usuarioService.buscarUsuariosPorNombre(nombre);
    const usuariosSinPassword = usuarios.map(({ password, ...rest }) => rest);
    res.status(200).json(usuariosSinPassword);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al buscar usuarios por nombre", error });
  }
};
