import { Router } from "express";
import { 
    crearUsuario, 
    obtenerUsuarios, 
    obtenerUsuariobyId,
    actualizarUsuario,
    eliminarUsuario,
    loginUsuario,
    cambiarPassword,
    buscarUsuariosPorRol,
    buscarUsuariosPorNombre,
    obtenerUsuariosActivos,
    obtenerUsuariosInactivos
} from "../controllers/usuarioController";
import { loginLimiter } from "../middleware/rateLimiter";
import { validateBody } from "../middleware/validate";
import { createUserSchema, loginSchema, updateUserSchema, changePasswordSchema } from "../schemas/usuarioSchemas";

const router = Router();

// Rutas públicas

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 */
router.post("/", validateBody(createUserSchema), crearUsuario);

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get("/", obtenerUsuarios);

/**
 * @swagger
 * /api/usuarios/activos:
 *   get:
 *     summary: Obtener todos los usuarios activos
 *     responses:
 *       200:
 *         description: Lista de usuarios activos
 */
router.get("/activos", obtenerUsuariosActivos);

/**
 * @swagger
 * /api/usuarios/inactivos:
 *   get:
 *     summary: Obtener todos los usuarios inactivos
 *     responses:
 *       200:
 *         description: Lista de usuarios inactivos
 */
router.get("/inactivos", obtenerUsuariosInactivos);

// Rutas de búsqueda

/**
 * @swagger
 * /api/usuarios/buscar:
 *   get:
 *     summary: Buscar usuarios por nombre
 *     parameters:
 *       - in: query
 *         name: nombre
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del usuario
 *     responses:
 *       200:
 *         description: Lista de usuarios con el nombre especificado
 */
router.get("/buscar", buscarUsuariosPorNombre);

/**
 * @swagger
 * /api/usuarios/rol/{rol}:
 *   get:
 *     summary: Buscar usuarios por rol
 *     parameters:
 *       - in: path
 *         name: rol
 *         required: true
 *         schema:
 *           type: string
 *         description: Rol del usuario
 *     responses:
 *       200:
 *         description: Lista de usuarios con el rol especificado
 */
router.get("/rol/:rol", buscarUsuariosPorRol);

// Ruta para obtener usuario por ID (debe ir después de las rutas anteriores)

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Detalles del usuario
 *       404:
 *         description: Usuario no encontrado
 */
router.get("/:id", obtenerUsuariobyId);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.put("/:id", validateBody(updateUserSchema), actualizarUsuario);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.delete("/:id", eliminarUsuario);

/**
 * @swagger
 * /api/usuarios/login:
 *   post:
 *     summary: Iniciar sesión de usuario
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login", loginLimiter, validateBody(loginSchema), loginUsuario);

/**
 * @swagger
 * /api/usuarios/{id}/cambiar-password:
 *   post:
 *     summary: Cambiar la contraseña de un usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Contraseña cambiada exitosamente
 *       404:
 *         description: Usuario no encontrado
 */
router.post("/:id/cambiar-password", validateBody(changePasswordSchema), cambiarPassword);

export default router;