// backend/src/routes/StatsRoutes.ts

import { Router } from 'express';
import { obtenerEstadisticasVentas, obtenerArticulosMasVendidos } from '../controllers/statsController';

const router = Router();

/**
 * @swagger
 * /api/Stats/ventas:
 *   get:
 *     summary: Obtener estadísticas de ventas
 *     responses:
 *       200:
 *         description: Estadísticas de ventas obtenidas exitosamente
 */
router.get('/ventas', obtenerEstadisticasVentas);

/**
 * @swagger
 * /api/Stats/articulos-mas-vendidos:
 *   get:
 *     summary: Obtener artículos más vendidos
 *     responses:
 *       200:
 *         description: Artículos más vendidos obtenidos exitosamente
 */
router.get('/articulos-mas-vendidos', obtenerArticulosMasVendidos);

export default router;