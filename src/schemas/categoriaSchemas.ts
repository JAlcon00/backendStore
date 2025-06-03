import Joi from 'joi';

export const createCategoriaSchema = Joi.object({
  nombre: Joi.string().required(),
  descripcion: Joi.string().required(),
  activo: Joi.boolean().default(true)
});

export const updateCategoriaSchema = Joi.object({
  nombre: Joi.string(),
  descripcion: Joi.string(),
  activo: Joi.boolean()
}).min(1);
