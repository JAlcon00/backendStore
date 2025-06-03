import Joi from 'joi';

export const createClienteSchema = Joi.object({
  nombre: Joi.string().required(),
  email: Joi.string().email().required(),
  direccion: Joi.string().required(),
  telefono: Joi.string().required(),
  activo: Joi.boolean().default(true)
});

export const updateClienteSchema = Joi.object({
  nombre: Joi.string(),
  email: Joi.string().email(),
  direccion: Joi.string(),
  telefono: Joi.string(),
  activo: Joi.boolean()
}).min(1);
