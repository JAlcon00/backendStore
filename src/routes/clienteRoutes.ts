import { Router } from "express";
import {

crearCliente,
obtenerClientes,
obtenerClientePorId,
actualizarCliente,
eliminarCliente,
buscarClientesPorNombre
} from "../controllers/clienteController";
import { validateBody } from '../middleware/validate';
import { createClienteSchema, updateClienteSchema } from '../schemas/clienteSchemas';

const router = Router();

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Crear un nuevo cliente
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *       400:
 *         description: Error de validación o email duplicado
 */
router.post("/", validateBody(createClienteSchema), crearCliente);

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Obtener todos los clientes
 *     responses:
 *       200:
 *         description: Lista de clientes
 */
router.get("/", obtenerClientes);

/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     summary: Obtener un cliente por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Detalles del cliente
 *       404:
 *         description: Cliente no encontrado
 */
router.get("/:id", obtenerClientePorId);

/**
 * @swagger
 * /api/clientes/{id}:
 *   put:
 *     summary: Actualizar un cliente por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente actualizado exitosamente
 *       404:
 *         description: Cliente no encontrado
 */
router.put("/:id", validateBody(updateClienteSchema), actualizarCliente);

/**
 * @swagger
 * /api/clientes/{id}:
 *   delete:
 *     summary: Eliminar un cliente por ID (borrado lógico)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cliente
 *     responses:
 *       200:
 *         description: Cliente eliminado exitosamente
 *       404:
 *         description: Cliente no encontrado
 */
router.delete("/:id", eliminarCliente);

/**
 * @swagger
 * /api/clientes/buscar:
 *   get:
 *     summary: Buscar clientes por nombre
 *     parameters:
 *       - in: query
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del cliente a buscar
 *     responses:
 *       200:
 *         description: Lista de clientes que coinciden con el nombre
 */
router.get("/buscar", buscarClientesPorNombre);

export default router;