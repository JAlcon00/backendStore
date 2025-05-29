// backend/src/routes/salesRoutes.ts
import { Router } from 'express';
import { obtenerVentasUltimos7Dias, obtenerResumenVentasMensual } from '../controllers/salesController';

const router = Router();

/**
 * @swagger
 * /api/sales/ultimos-7-dias:
 *   get:
 *     summary: Obtener ventas de los últimos 7 días
 *     responses:
 *       200:
 *         description: Ventas de los últimos 7 días obtenidas exitosamente
 */
router.get('/ultimos-7-dias', obtenerVentasUltimos7Dias);

/**
 * @swagger
 * /api/sales/resumen-mensual:
 *   get:
 *     summary: Obtener resumen de ventas mensual
 *     responses:
 *       200:
 *         description: Resumen de ventas mensual obtenido exitosamente
 */
router.get('/resumen-mensual', obtenerResumenVentasMensual);

export default router;