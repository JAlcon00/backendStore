import { Request, Response, NextFunction } from 'express';

// Middleware de autenticación vacío, ya que no se usará JWT
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  next();
};

export const authorize = (_roles: Array<'cliente' | 'admin'>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    next();
  };
};
