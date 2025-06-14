// backend/src/controllers/salesController.ts
import { Request, Response } from 'express';
import * as salesService from '../services/salesService';

// Obtener ventas de los últimos 7 días
export const obtenerVentasUltimos7Dias = async (req: Request, res: Response) => {
    try {
        const ventas = await salesService.obtenerVentasUltimos7Dias();
        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ventas de los últimos 7 días', error });
    }
};

// Obtener resumen de ventas mensual
export const obtenerResumenVentasMensual = async (req: Request, res: Response) => {
    try {
        const resumen = await salesService.obtenerResumenVentasMensual();
        res.status(200).json(resumen);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el resumen de ventas mensual', error });
    }
};

// Crear venta desde un pedido
export const crearVentaDesdePedido = async (req: Request, res: Response) => {
    try {
        const { pedidoId } = req.body;
        const venta = await salesService.crearVentaDesdePedido(pedidoId);
        res.status(201).json(venta);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la venta desde el pedido', error });
    }
};

export const getVentasRealizadas = async (req: Request, res: Response) => {
    try {
        const { usuarioId } = req.body;
        const ventas = await salesService.getVentasRealizadas(usuarioId);
        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ventas realizadas', error });
    }
}
export const getVentasPorPedido = async (req: Request, res: Response) => {
    try {
        const { pedidoId } = req.params;
        const venta = await salesService.getVentasPorPedido(pedidoId);
        res.status(200).json(venta);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ventas por pedido', error });
    }
};
export const getVentasPorUsuario = async (req: Request, res: Response) => {
    try {
        const { usuarioId } = req.params;
        const ventas = await salesService.getVentasPorUsuario(usuarioId);
        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ventas por usuario', error });
    }
};

export const getVentasPorFecha = async (req: Request, res: Response) => {
    try {
        const { fecha } = req.params;
        const ventas = await salesService.getVentasPorFecha(fecha);
        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ventas por fecha', error });
    }
};
export const getVentasPorPedidoYUsuario = async (req: Request, res: Response) => {
    try {
        const { pedidoId, usuarioId } = req.params;
        const ventas = await salesService.getVentasPorPedidoYUsuario(pedidoId, usuarioId);
        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ventas por pedido y usuario', error });
    }
};

// Eliminar venta por pedido
export const borrarVentaPorPedido = async (req: Request, res: Response) => {
  try {
    const { pedidoId } = req.params;
    await salesService.borrarVentaPorPedido(pedidoId);
    res.status(200).json({ message: 'Venta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la venta', error });
  }
};

// Obtener todas las ventas
export const getAllVentas = async (req: Request, res: Response) => {
    try {
        const ventas = await salesService.getAllVentas();
        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener todas las ventas', error });
    }
};
