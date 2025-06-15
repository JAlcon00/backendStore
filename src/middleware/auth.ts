import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

// Verificar que JWT_SECRET esté configurado
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET no está configurado en las variables de entorno');
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET as string);
    // @ts-ignore
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

/**
 * Middleware para requerir uno o varios roles en rutas protegidas.
 * Uso: router.get('/ruta', authMiddleware, requireRole(['admin']), handler)
 */
export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
  };
}

/**
 * Genera un token JWT para un usuario
 */
export function generateToken(payload: any): string {
  return jwt.sign(payload, JWT_SECRET as string, { 
    expiresIn: '24h' // El token expira en 24 horas
  });
}
