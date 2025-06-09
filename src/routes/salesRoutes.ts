// backend/src/routes/salesRoutes.ts
import { Router } from 'express';
import { obtenerVentasUltimos7Dias, obtenerResumenVentasMensual, crearVentaDesdePedido, getVentasRealizadas, getAllVentas, borrarVentaPorPedido } from '../controllers/salesController';
import { getVentasPorPedido, getVentasPorUsuario, getVentasPorFecha, getVentasPorPedidoYUsuario } from '../controllers/salesController';

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

/**
 * @swagger
 * /api/sales/usuario/{usuarioId}:
 *   get:
 *     summary: Obtener ventas por usuario
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ventas por usuario obtenidas exitosamente
 */
router.get('/usuario/:usuarioId', getVentasPorUsuario);

/**
 * @swagger
 * /api/sales/fecha/{fecha}:
 *   get:
 *     summary: Obtener ventas por fecha
 *     parameters:
 *       - in: path
 *         name: fecha
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ventas por fecha obtenidas exitosamente
 */
router.get('/fecha/:fecha', getVentasPorFecha);

/**
 * @swagger
 * /api/sales/{pedidoId}:
 *   get:
 *     summary: Obtener ventas por pedido
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ventas por pedido obtenidas exitosamente
 */
router.get('/:pedidoId', getVentasPorPedido);

router.get('/pedido-usuario/:pedidoId/:usuarioId', getVentasPorPedidoYUsuario);

// Endpoint para obtener todas las ventas
router.get('/', getAllVentas);

// Endpoint para eliminar venta por pedido
router.delete('/:pedidoId', borrarVentaPorPedido);

export default router;

