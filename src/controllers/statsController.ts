// backend/src/controllers/StatsController.ts

import { Request, Response } from 'express';
import * as statsService from '../services/statsService';

// Obtener estadísticas de ventas
export const obtenerEstadisticasVentas = async (req: Request, res: Response) => {
  try {
    const estadisticas = await statsService.obtenerEstadisticasVentas();
    // El servicio ahora devuelve un objeto con totalVentas y desglosePedidos
    res.status(200).json(estadisticas); 
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las estadísticas de ventas', error });
  }
};

// Obtener artículos más vendidos
export const obtenerArticulosMasVendidos = async (req: Request, res: Response) => {
  console.log('[statsController] Iniciando obtenerArticulosMasVendidos');
  try {
    const articulosMasVendidos = await statsService.obtenerArticulosMasVendidos();
    console.log('[statsController] Datos recibidos del servicio para articulosMasVendidos:', articulosMasVendidos);
    res.status(200).json(articulosMasVendidos);
  } catch (error) {
    console.error('[statsController] Error en obtenerArticulosMasVendidos:', error);
    res.status(500).json({ message: 'Error al obtener los artículos más vendidos', error });
  }
};