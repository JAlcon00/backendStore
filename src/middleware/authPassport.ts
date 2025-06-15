import { Request, Response, NextFunction } from 'express';
import passport from './passport';

// Middleware para verificar autenticación general
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ error: 'No autenticado' });
  }
}

// Middleware para verificar autenticación de administradores
export function authAdminMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated() && req.user) {
    // @ts-ignore
    const user = req.user as any;
    if (user.rol && (user.rol === 'admin' || user.rol === 'superadmin')) {
      next();
    } else {
      res.status(403).json({ error: 'Acceso denegado - Se requieren privilegios de administrador' });
    }
  } else {
    res.status(401).json({ error: 'No autenticado' });
  }
}

// Middleware para verificar autenticación de clientes
export function authClienteMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.isAuthenticated() && req.user) {
    // @ts-ignore
    const user = req.user as any;
    // Si es cliente (no tiene rol) o si es admin que puede ver todo
    if (!user.rol || user.rol === 'admin' || user.rol === 'superadmin') {
      next();
    } else {
      res.status(403).json({ error: 'Acceso denegado' });
    }
  } else {
    res.status(401).json({ error: 'No autenticado' });
  }
}

/**
 * Middleware para requerir uno o varios roles específicos en rutas protegidas.
 * Uso: router.get('/ruta', authMiddleware, requireRole(['admin']), handler)
 */
export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && req.user) {
      // @ts-ignore
      const user = req.user as any;
      if (user.rol && roles.includes(user.rol)) {
        next();
      } else {
        return res.status(403).json({ error: 'Acceso denegado - Rol insuficiente' });
      }
    } else {
      return res.status(401).json({ error: 'No autenticado' });
    }
  };
}

// Función para login de usuarios administradores
export const loginUsuario = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('usuario-local', (err: any, user: any, info: any) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    if (!user) {
      return res.status(401).json({ error: info?.message || 'Credenciales inválidas' });
    }
    
    req.logIn(user, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al iniciar sesión' });
      }
      return res.status(200).json({ 
        message: 'Login exitoso', 
        usuario: { 
          id: user._id, 
          nombre: user.nombre, 
          rol: user.rol 
        } 
      });
    });
  })(req, res, next);
};

// Función para login de clientes
export const loginCliente = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('cliente-local', (err: any, cliente: any, info: any) => {
    if (err) {
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
    if (!cliente) {
      return res.status(401).json({ error: info?.message || 'Credenciales inválidas' });
    }
    
    req.logIn(cliente, (err) => {
      if (err) {
        return res.status(500).json({ error: 'Error al iniciar sesión' });
      }
      return res.status(200).json({ 
        message: 'Login exitoso', 
        cliente: { 
          id: cliente._id, 
          nombre: cliente.nombre, 
          email: cliente.email 
        } 
      });
    });
  })(req, res, next);
};

// Función para logout
export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al cerrar sesión' });
    }
    res.status(200).json({ message: 'Logout exitoso' });
  });
};
