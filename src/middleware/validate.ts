import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log('[validateBody] Middleware ejecutado');
    console.log('[validateBody] Body recibido:', JSON.stringify(req.body, null, 2));
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      console.error('[validateBody] Error de validación:', error.details);
      res.status(400).json({ message: 'Error de validación', details: error.details });
      return;
    }
    next();
  };
};
