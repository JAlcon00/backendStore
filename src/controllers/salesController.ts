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