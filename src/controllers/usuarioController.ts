import { Request, Response, NextFunction } from "express";
import * as usuarioService from "../services/usuarioService";
import { encryptData, decryptData } from '../utils/crypto';
import logger from '../utils/logger';

// Crear un nuevo usuario
export const crearUsuario = async (req: Request, res: Response) => {
    try {
        // Encriptar datos sensibles
        const { nombre, email, direccion, telefono, ...rest } = req.body;
        logger.info('🔒 Encriptando datos de usuario...');
        const encrypted = {
          ...rest,
          nombre: encryptData(nombre),
          email: encryptData(email),
          direccion: encryptData(direccion),
          telefono: encryptData(telefono)
        };
        const usuario = await usuarioService.crearUsuario(encrypted);
        // Desencriptar para la respuesta
        const { password, ...usuarioSinPassword } = usuario;
        const decryptedUsuario = {
          ...usuarioSinPassword,
          nombre: decryptData(usuarioSinPassword.nombre),
          email: decryptData(usuarioSinPassword.email),
          direccion: decryptData(usuarioSinPassword.direccion),
          telefono: decryptData(usuarioSinPassword.telefono)
        };
        // No se genera token JWT
        res.status(201).json({ user: decryptedUsuario });
        logger.info(`✅ Usuario registrado exitosamente - ID: ${usuario._id}`);
    } catch (error) {
        if (
            error instanceof Error &&
            error.message === "El email ya está registrado"
        ) {
            logger.warn('Email ya registrado');
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
      // Desencriptar campos sensibles
      const { password, ...rest } = usuario;
      const decrypted = {
        ...rest,
        nombre: decryptData(rest.nombre),
        email: decryptData(rest.email),
        direccion: decryptData(rest.direccion),
        telefono: decryptData(rest.telefono)
      };
      res.status(200).json(decrypted);
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

// Login de usuario con rate limiting
export const loginUsuario = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Email y password son requeridos" });
      return;
    }

    // Encriptar email para buscar
    logger.info('🔒 Encriptando email para login...');
    const encryptedEmail = encryptData(email);
    const usuario = await usuarioService.loginUsuario(encryptedEmail, password);
    if (usuario) {
      // Desencriptar datos antes de responder
      const { password, ...rest } = usuario;
      const decrypted = {
        ...rest,
        nombre: decryptData(rest.nombre),
        email: decryptData(rest.email),
        direccion: decryptData(rest.direccion),
        telefono: decryptData(rest.telefono)
      };
      // No se genera token JWT
      res.status(200).json({ user: decrypted });
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
