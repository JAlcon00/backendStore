import Joi from 'joi';

export const createUserSchema = Joi.object({
  nombre: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  direccion: Joi.string().required(),
  telefono: Joi.string().required(),
  role: Joi.string().valid('cliente', 'admin').default('cliente')
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const changePasswordSchema = Joi.object({
  nuevaPassword: Joi.string().min(6).required()
});

export const updateUserSchema = Joi.object({
  nombre: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  direccion: Joi.string(),
  telefono: Joi.string()
}).min(1);
