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
import { validateBody } from '../middleware/validate';
import { createArticuloSchema, updateArticuloSchema } from '../schemas/articuloSchemas';
import multer from 'multer';
import path from 'path';
import { Request, Response } from 'express';

const router = Router();

/**
 * @swagger
 * /api/articulos:
 *   post:
 *     summary: Crear un nuevo artículo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoria:
 *                 type: string
 *               imagenes:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 description: URLs de imágenes del producto
 *               activo:
 *                 type: boolean
 *             required:
 *               - nombre
 *               - descripcion
 *               - precio
 *               - stock
 *               - categoria
 *     responses:
 *       201:
 *         description: Artículo creado exitosamente
 */
router.post("/", validateBody(createArticuloSchema), crearArticulo);

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               precio:
 *                 type: number
 *               stock:
 *                 type: integer
 *               categoria:
 *                 type: string
 *               imagenes:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 description: URLs de imágenes del producto
 *               activo:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Artículo actualizado exitosamente
 *       404:
 *         description: Artículo no encontrado
 */
router.put('/:id', validateBody(updateArticuloSchema), actualizarArticulo);

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

// Configuración de almacenamiento para imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads/articulos'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Solo se permiten imágenes JPG, JPEG o PNG'));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

/**
 * @swagger
 * /api/articulos/upload:
 *   post:
 *     summary: Subir una imagen de artículo
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Imagen subida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: URL de la imagen subida
 */
router.post('/upload', upload.single('imagen'), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: 'No se subió ninguna imagen o el formato/tamaño es inválido' });
    return;
  }
  const url = `/uploads/articulos/${req.file.filename}`;
  res.json({ url });
});

export default router;