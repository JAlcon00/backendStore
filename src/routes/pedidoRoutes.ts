import { Router } from "express";
import {
    crearPedido,
    obtenerPedidos,
    obtenerPedidoById,
    obtenerPedidosPorUsuario,
    actualizarEstadoPedido,
    cancelarPedido,
    actualizarPedido,
    eliminarPedido
} from '../controllers/pedidoController';

const router = Router();

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Crear un nuevo pedido
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 */
router.post('/', crearPedido);

/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     summary: Obtener todos los pedidos
 *     responses:
 *       200:
 *         description: Lista de pedidos
 */
router.get('/', obtenerPedidos);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   get:
 *     summary: Obtener un pedido por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pedido
 *     responses:
 *       200:
 *         description: Detalles del pedido
 *       404:
 *         description: Pedido no encontrado
 */
router.get('/:id', obtenerPedidoById);

/**
 * @swagger
 * /api/pedidos/usuario/{usuarioId}:
 *   get:
 *     summary: Obtener pedidos por ID de usuario
 *     parameters:
 *       - in: path
 *         name: usuarioId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Lista de pedidos del usuario
 */
router.get('/usuario/:usuarioId', obtenerPedidosPorUsuario);

/**
 * @swagger
 * /api/pedidos/{id}/estado:
 *   put:
 *     summary: Actualizar el estado de un pedido por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pedido
 *     responses:
 *       200:
 *         description: Estado del pedido actualizado exitosamente
 *       404:
 *         description: Pedido no encontrado
 */
router.put('/:id/estado', actualizarEstadoPedido);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   put:
 *     summary: Actualizar un pedido por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pedido
 *     responses:
 *       200:
 *         description: Pedido actualizado exitosamente
 *       404:
 *         description: Pedido no encontrado
 */
router.put('/:id', actualizarPedido);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   delete:
 *     summary: Eliminar un pedido por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pedido
 *     responses:
 *       200:
 *         description: Pedido eliminado exitosamente
 *       404:
 *         description: Pedido no encontrado
 */
router.delete('/:id', eliminarPedido);

/**
 * @swagger
 * /api/pedidos/{id}/cancelar:
 *   post:
 *     summary: Cancelar un pedido por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pedido
 *     responses:
 *       200:
 *         description: Pedido cancelado exitosamente
 *       404:
 *         description: Pedido no encontrado
 */
router.post('/:id/cancelar', cancelarPedido);

export default router;