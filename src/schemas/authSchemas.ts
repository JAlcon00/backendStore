import Joi from 'joi';

// Esquema para login de usuarios
export const loginSchema = Joi.object({
  nombre: Joi.string().required().messages({
    'string.empty': 'El nombre es requerido',
    'any.required': 'El nombre es requerido'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'La contraseña es requerida',
    'any.required': 'La contraseña es requerida'
  })
});

// Esquema para login de clientes
export const clienteLoginSchema = Joi.object({
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

// Esquema para registro de clientes
export const clienteRegistroSchema = Joi.object({
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
