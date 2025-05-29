import { Request, Response, NextFunction } from "express";
import * as pedidoService from '../services/pedidoService';

// Crear un nuevo pedido
export const crearPedido = async (req: Request, res: Response) => {
    try {
        const pedido = await pedidoService.crearPedido(req.body);
        res.status(201).json(pedido);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el pedido', error });
    }
};

// Obtener todos los pedidos
export const obtenerPedidos = async (req: Request, res: Response) => {
    try {
        const pedidos = await pedidoService.obtenerPedidos();
        res.status(200).json(pedidos);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pedidos', error });
    }
};


// Obtener pedido por ID
export const obtenerPedidoById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pedido = await pedidoService.obtenerPedidoById(req.params.id);
        res.status(200).json(pedido);
    } catch (error) {
        next(error);
    }

};


// Obtener pedidos por usuario
export const obtenerPedidosPorUsuario = async (req: Request, res: Response) => {
    try {
        const pedidos = await pedidoService.obtenerPedidosPorUsuario(req.params.usuarioId);
        res.status(200).json({message: 'Pedidos obtenidos correctamente', pedidos});
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pedidos del usuario', error });
    }
};

// Actualizar estado del pedido
export const actualizarEstadoPedido = async (req: Request, res: Response) => {
    try {
        const actualizado = await pedidoService.actualizarEstadoPedido(req.params.id, req.body.estado);
        res.status(200).json({ message: 'Estado del pedido actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el estado del pedido', error });
    }
};


// Cancelar pedido

export const cancelarPedido = async (req: Request, res: Response) => {
    try {
        const cancelado = await pedidoService.cancelarPedido(req.params.id);
        res.status(200).json({ message: 'Pedido cancelado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cancelar el pedido', error });
    }
};


// Actualizar pedido

export const actualizarPedido = async (req: Request, res: Response) => {
    try {
        const actualizado = await pedidoService.actualizarPedido(req.params.id, req.body);
        res.status(200).json({ message: 'Pedido actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el pedido', error });
    }
};


// Eliminar pedido (borrado lógico)

export const eliminarPedido = async (req: Request, res: Response) => {
    try {
        const eliminado = await pedidoService.eliminarPedido(req.params.id);
        res.status(200).json({ message: 'Pedido eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el pedido', error });
    }
};
