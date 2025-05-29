import { Request, Response, NextFunction } from "express";
import * as clienteService from "../services/clienteService";

// Crear un nuevo cliente
export const crearCliente = async (req: Request, res: Response) => {
    try {
        const cliente = await clienteService.crearCliente(req.body);
        res.status(201).json(cliente);
    } catch (error) {
        if (error instanceof Error && error.message === 'El email ya está registrado') {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Error al crear el cliente", error });
        }
    }
};

// Obtener todos los clientes
export const obtenerClientes = async (req: Request, res: Response) => {
    try {
        const clientes = await clienteService.obtenerClientes();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los clientes", error });
    }
};

// Obtener cliente por ID
export const obtenerClientePorId = async (req: Request, res: Response) => {
    try {
        const cliente = await clienteService.obtenerClientePorId(req.params.id);
        if (cliente) {
            res.status(200).json(cliente);
        } else {
            res.status(404).json({ message: "Cliente no encontrado" });
        }
    } catch (error) {
        if (error instanceof Error && error.message === "ID de cliente inválido") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Error al obtener el cliente", error });
        }
    }
};

// Actualizar cliente
export const actualizarCliente = async (req: Request, res: Response) => {
    try {
        const actualizado = await clienteService.actualizarCliente(req.params.id, req.body);
        if (actualizado) {
            const cliente = await clienteService.obtenerClientePorId(req.params.id);
            res.status(200).json(cliente);
        } else {
            res.status(404).json({ message: "Cliente no encontrado" });
        }
    } catch (error) {
        if (error instanceof Error && error.message === "El email ya está registrado") {
            res.status(400).json({ message: error.message });
        } else {
            res.status(500).json({ message: "Error al actualizar el cliente", error });
        }
    }
};

// Eliminar cliente (borrado lógico)
export const eliminarCliente = async (req: Request, res: Response) => {
    try {
        const eliminado = await clienteService.eliminarCliente(req.params.id);
        if (eliminado) {
            res.status(200).json({ message: "Cliente eliminado con éxito" });
        } else {
            res.status(404).json({ message: "Cliente no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el cliente", error });
    }
};

// Buscar clientes por nombre
export const buscarClientesPorNombre = async (req: Request, res: Response) => {
    try {
        const nombre = req.query.nombre as string;
        !nombre ? res.status(400).json({ message: "El nombre es requerido" }) : null;

        const clientes = await clienteService.buscarClientesPorNombre(nombre);
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar clientes", error });
    }
};