import { Router, Request, Response } from 'express';
import { authAdminMiddleware, authClienteMiddleware, authMiddleware } from '../middleware/authPassport';

const router = Router();

/**
 * @swagger
 * /api/protected/admin:
 *   get:
 *     summary: Ruta protegida solo para administradores
 *     responses:
 *       200:
 *         description: Acceso concedido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 */
router.get('/admin', authAdminMiddleware, (req: Request, res: Response): void => {
  res.json({ 
    message: 'Acceso concedido a administrador', 
    usuario: req.user 
  });
});

/**
 * @swagger
 * /api/protected/cliente:
 *   get:
 *     summary: Ruta protegida para clientes
 *     responses:
 *       200:
 *         description: Acceso concedido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Acceso denegado
 */
router.get('/cliente', authClienteMiddleware, (req: Request, res: Response): void => {
  res.json({ 
    message: 'Acceso concedido a cliente', 
    usuario: req.user 
  });
});

/**
 * @swagger
 * /api/protected/general:
 *   get:
 *     summary: Ruta protegida para cualquier usuario autenticado
 *     responses:
 *       200:
 *         description: Acceso concedido
 *       401:
 *         description: No autenticado
 */
router.get('/general', authMiddleware, (req: Request, res: Response): void => {
  res.json({ 
    message: 'Acceso concedido a usuario autenticado', 
    usuario: req.user 
  });
});

export default router;
