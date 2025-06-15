import { Request, Response } from "express";
import { UsuarioModel } from "../models/usuarioModels";
import { ClienteModel } from "../models/clienteModels";

// Login para usuarios administradores
export const loginUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre, password } = req.body;
        const usuario = await UsuarioModel.Login(nombre, password);
        
        if (usuario) {
            // Establecer sesión
            // @ts-ignore
            req.session.user = {
                id: usuario._id,
                nombre: usuario.nombre,
                rol: usuario.rol,
                tipo: 'usuario'
            };
            
            res.status(200).json({
                message: 'Login exitoso',
                usuario: {
                    id: usuario._id,
                    nombre: usuario.nombre,
                    rol: usuario.rol
                }
            });
        } else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Login para clientes
export const loginCliente = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const cliente = await ClienteModel.login(email, password);
        
        if (cliente) {
            // Establecer sesión
            // @ts-ignore
            req.session.user = {
                id: cliente._id,
                nombre: cliente.nombre,
                email: cliente.email,
                tipo: 'cliente'
            };
            
            res.status(200).json({
                message: 'Login exitoso',
                cliente: {
                    id: cliente._id,
                    nombre: cliente.nombre,
                    email: cliente.email
                }
            });
        } else {
            res.status(401).json({ error: 'Credenciales inválidas' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

// Registro de cliente
export const registrarCliente = async (req: Request, res: Response): Promise<void> => {
    try {
        const cliente = await ClienteModel.registrar(req.body);
        res.status(201).json({
            message: 'Cliente registrado exitosamente',
            cliente: {
                id: cliente._id,
                nombre: cliente.nombre,
                email: cliente.email
            }
        });
    } catch (error) {
        if (error instanceof Error && error.message === 'El email ya está registrado') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'Error al registrar cliente', error });
        }
    }
};

// Logout
export const logout = (req: Request, res: Response): void => {
    // @ts-ignore
    if (req.session) {
        // @ts-ignore
        req.session.destroy((err: any) => {
            if (err) {
                return res.status(500).json({ error: 'Error al cerrar sesión' });
            }
            res.status(200).json({ message: 'Logout exitoso' });
        });
    } else {
        res.status(200).json({ message: 'No hay sesión activa' });
    }
};

// Obtener información del usuario autenticado
export const me = (req: Request, res: Response): void => {
    // @ts-ignore
    if (req.session && req.session.user) {
        // @ts-ignore
        res.status(200).json({ usuario: req.session.user });
    } else {
        res.status(401).json({ error: 'No autenticado' });
    }
};
