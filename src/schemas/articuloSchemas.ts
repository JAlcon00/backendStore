import Joi from 'joi';

export const createArticuloSchema = Joi.object({
  nombre: Joi.string().required(),
  descripcion: Joi.string().required(),
  precio: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).required(),
  categoria: Joi.string().required(),
  imagenes: Joi.array().items(Joi.string().uri()).optional(), // NUEVO
  activo: Joi.boolean().default(true)
});

export const updateArticuloSchema = Joi.object({
  nombre: Joi.string(),
  descripcion: Joi.string(),
  precio: Joi.number().positive(),
  stock: Joi.number().integer().min(0),
  categoria: Joi.string(),
  imagenes: Joi.array().items(Joi.string().uri()), // NUEVO
  activo: Joi.boolean()
}).min(1);
