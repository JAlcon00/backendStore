import { Router } from "express";
import { 
    crearArticulo, 
    obtenerArticulos, 
    actualizarArticulo,
    obtenerArticuloById,
    eliminarArticulo,
    buscarArticulosPorCategoria,
    buscarArticulosPorNombre,
    obtenerArticulosDestacados
} from "../controllers/articuloController";

const router = Router();

/**
 * @swagger
 * /api/articulos:
 *   post:
 *     summary: Crear un nuevo artículo
 *     responses:
 *       201:
 *         description: Artículo creado exitosamente
 */
router.post("/", crearArticulo);

/**
 * @swagger
 * /api/articulos:
 *   get:
 *     summary: Obtener todos los artículos
 *     responses:
 *       200:
 *         description: Lista de artículos
 */
router.get("/", obtenerArticulos);

/**
 * @swagger
 * /api/articulos/{id}:
 *   get:
 *     summary: Obtener un artículo por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del artículo
 *     responses:
 *       200:
 *         description: Detalles del artículo
 *       404:
 *         description: Artículo no encontrado
 */
router.get("/:id", obtenerArticuloById);

/**
 * @swagger
 * /api/articulos/{id}:
 *   put:
 *     summary: Actualizar un artículo por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del artículo
 *     responses:
 *       200:
 *         description: Artículo actualizado exitosamente
 *       404:
 *         description: Artículo no encontrado
 */
router.put("/:id", actualizarArticulo);

/**
 * @swagger
 * /api/articulos/{id}:
 *   delete:
 *     summary: Eliminar un artículo por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del artículo
 *     responses:
 *       200:
 *         description: Artículo eliminado exitosamente
 *       404:
 *         description: Artículo no encontrado
 */
router.delete("/:id", eliminarArticulo);

/**
 * @swagger
 * /api/articulos/categoria/{categoria}:
 *   get:
 *     summary: Buscar artículos por categoría
 *     parameters:
 *       - in: path
 *         name: categoria
 *         required: true
 *         schema:
 *           type: string
 *         description: Categoría del artículo
 *     responses:
 *       200:
 *         description: Lista de artículos en la categoría
 */
router.get("/categoria/:categoria", buscarArticulosPorCategoria);

/**
 * @swagger
 * /api/articulos/nombre/{nombre}:
 *   get:
 *     summary: Buscar artículos por nombre
 *     parameters:
 *       - in: path
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del artículo
 *     responses:
 *       200:
 *         description: Lista de artículos con el nombre especificado
 */
router.get("/nombre/:nombre", buscarArticulosPorNombre);

/**
 * @swagger
 * /api/articulos/destacados:
 *   get:
 *     summary: Obtener artículos destacados
 *     responses:
 *       200:
 *         description: Lista de artículos destacados
 */
router.get("/destacados", obtenerArticulosDestacados);

export default router;