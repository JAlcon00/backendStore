import { Router } from "express";
import {
    loginUsuario,
    loginCliente,
    registrarCliente,
    logout,
    me
} from "../controllers/authController";
import { validateBody } from '../middleware/validate';
import Joi from 'joi';

const router = Router();

// Esquemas de validación
const loginSchema = Joi.object({
    nombre: Joi.string().required().messages({
        'string.empty': 'El nombre es requerido',
        'any.required': 'El nombre es requerido'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'La contraseña es requerida',
        'any.required': 'La contraseña es requerida'
    })
});

const clienteLoginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.empty': 'El email es requerido',
        'string.email': 'Email inválido',
        'any.required': 'El email es requerido'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'La contraseña es requerida',
        'any.required': 'La contraseña es requerida'
    })
});

const clienteRegistroSchema = Joi.object({
    nombre: Joi.string().required().messages({
        'string.empty': 'El nombre es requerido',
        'any.required': 'El nombre es requerido'
    }),
    apellido: Joi.string().required().messages({
        'string.empty': 'El apellido es requerido',
        'any.required': 'El apellido es requerido'
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'El email es requerido',
        'string.email': 'Email inválido',
        'any.required': 'El email es requerido'
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'La contraseña es requerida',
        'string.min': 'La contraseña debe tener al menos 6 caracteres',
        'any.required': 'La contraseña es requerida'
    }),
    telefono: Joi.string().required().messages({
        'string.empty': 'El teléfono es requerido',
        'any.required': 'El teléfono es requerido'
    }),
    direccion: Joi.string().required().messages({
        'string.empty': 'La dirección es requerida',
        'any.required': 'La dirección es requerida'
    }),
    rfc: Joi.string().optional().allow('')
});

/**
 * @swagger
 * /api/auth/login/usuario:
 *   post:
 *     summary: Login para usuarios administradores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login/usuario", validateBody(loginSchema), loginUsuario);

/**
 * @swagger
 * /api/auth/login/cliente:
 *   post:
 *     summary: Login para clientes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post("/login/cliente", validateBody(clienteLoginSchema), loginCliente);

/**
 * @swagger
 * /api/auth/registro/cliente:
 *   post:
 *     summary: Registro de nuevo cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               telefono:
 *                 type: string
 *               direccion:
 *                 type: string
 *               rfc:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cliente registrado exitosamente
 *       400:
 *         description: Error de validación
 */
router.post("/registro/cliente", validateBody(clienteRegistroSchema), registrarCliente);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     responses:
 *       200:
 *         description: Logout exitoso
 */
router.post("/logout", logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener información del usuario autenticado
 *     responses:
 *       200:
 *         description: Información del usuario
 *       401:
 *         description: No autenticado
 */
router.get("/me", me);

export default router;
