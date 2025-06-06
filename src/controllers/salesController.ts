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