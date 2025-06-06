// backend/src/routes/salesRoutes.ts
import { Router } from 'express';
import { obtenerVentasUltimos7Dias, obtenerResumenVentasMensual, crearVentaDesdePedido, getVentasRealizadas } from '../controllers/salesController';

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

/**
 * @swagger
 * /api/sales:
 *   post:
 *     summary: Crear una venta desde un pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pedidoId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Venta creada exitosamente
 */
router.post('/', crearVentaDesdePedido);

/**
 * @swagger
 * /api/sales/realizadas:
 *   post:
 *     summary: Obtener ventas realizadas por un usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuarioId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ventas realizadas obtenidas exitosamente
 */

router.post('/realizadas', async (req, res) => {
    try {
        const { usuarioId } = req.body;
        const ventas = await getVentasRealizadas(usuarioId, res);
        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener las ventas realizadas', error });
    }
});
export default router;

