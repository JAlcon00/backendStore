import Joi from 'joi';

export const createUserSchema = Joi.object({
  nombre: Joi.string().required(),
  password: Joi.string().min(6).required(),
  rol: Joi.string().valid('cliente', 'admin', 'superadmin').required()
});

export const loginSchema = Joi.object({
  nombre: Joi.string().required(),
  password: Joi.string().required()
});

export const changePasswordSchema = Joi.object({
  nuevaPassword: Joi.string().min(6).required()
});

export const updateUserSchema = Joi.object({
  nombre: Joi.string(),
  password: Joi.string().min(6),
  rol: Joi.string().valid('cliente', 'admin', 'superadmin')
}).min(1);
