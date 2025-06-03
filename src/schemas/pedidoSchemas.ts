import Joi from 'joi';

export const createPedidoSchema = Joi.object({
  cliente: Joi.string().required(),
  detalles: Joi.array().items(
    Joi.object({
      articulo: Joi.string().required(),
      cantidad: Joi.number().integer().min(1).required(),
      precioUnitario: Joi.number().positive().required()
    })
  ).min(1).required(),
  estado: Joi.string().valid('pendiente', 'procesado', 'entregado', 'cancelado').default('pendiente'),
  fechaCreacion: Joi.date(),
  activo: Joi.boolean().default(true)
});

export const updatePedidoSchema = Joi.object({
  cliente: Joi.string(),
  detalles: Joi.array().items(
    Joi.object({
      articulo: Joi.string(),
      cantidad: Joi.number().integer().min(1),
      precioUnitario: Joi.number().positive()
    })
  ),
  estado: Joi.string().valid('pendiente', 'procesado', 'entregado', 'cancelado'),
  fechaCreacion: Joi.date(),
  activo: Joi.boolean()
}).min(1);
