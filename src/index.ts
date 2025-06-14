import express, { Request, Response, NextFunction } from 'express';
import session from 'express-session';
import passport from './middleware/passport';
import logger from './utils/logger';
import expressWinston from 'express-winston';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import {
  connectDB,
  closeDB,
  getUsuariosCollection,
  getArticulosCollection,
  getPedidosCollection,
  getCategoriasCollection,
  getClienteCollection,
  getStatsCollection,
  getSalesCollection
} from './config/db.config';
import { setupSwagger } from './config/swaggerConfig';
import articuloRoutes from './routes/articuloRoutes';
import categoriaRoutes from './routes/categoriaRoutes';
import clienteRoutes from './routes/clienteRoutes';
import pedidoRoutes from './routes/pedidoRoutes';
import statsRoutes from './routes/statsRoutes';
import salesRoutes from './routes/salesRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import authRoutes from './routes/authRoutes';
import protectedRoutes from './routes/protectedRoutes';

const PORT = process.env.PORT || 3005;
const app = express();

// Middleware HTTP logs
app.use(expressWinston.logger({
  winstonInstance: logger,
  meta: true,
  expressFormat: true,
  colorize: true
}));

// Middleware
const allowedOrigins = [
  'http://localhost:5173', // Vite local
  'http://localhost:3000', // React local (si aplica)
  'https://tudominio-frontend.com', // Producción, reemplaza por tu dominio real
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Permite peticiones sin origen (Postman, Android, etc.)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Permite todo para compatibilidad, o puedes devolver un error si quieres restringir
    return callback(null, true);
  },
  credentials: true, // Habilitamos cookies para las sesiones
}));

app.use(express.json());

// Configuración de sesiones
app.use(session({
  secret: 'tu_secreto_super_seguro_para_sesiones_2025', // En producción, usa una variable de entorno
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // En producción con HTTPS, cambiar a true
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 horas
  }
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads/articulos', express.static(path.join(__dirname, '../uploads/articulos')));

// Swagger
setupSwagger(app);

// Montar rutas de la API
app.use('/api/auth', authRoutes); // Nueva ruta de autenticación
// app.use('/api/protected', protectedRoutes); // Rutas protegidas de ejemplo - comentadas temporalmente
app.use('/api/articulos', articuloRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Manejar rutas no definidas (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware global de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error capturado:', err);
  const status = err.statusCode || err.status || 500;
  const message = err.message || 'Error interno del servidor';
  res.status(status).json({ error: message });
});

// Ruta de prueba de conexión a la base de datos
app.get('/api/test', async (req, res) => {
  try {
    const usuarios = await getUsuariosCollection();
    const count = await usuarios.countDocuments();
    res.json({ message: 'Conexión exitosa', documentCount: count });
  } catch (error) {
    res.status(500).json({ error: 'Error al conectar con la base de datos' });
  }
});

// Inicialización del servidor
async function iniciarServidor() {
  try {
    // Crear carpeta de uploads si no existe
    const uploadsDir = path.join(__dirname, '../uploads/articulos');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    await connectDB();
    // Crear índices si no existen
    logger.info('🔧 Creando índices en colecciones...');
    await getUsuariosCollection().then(col => col.createIndex({ email: 1 }, { unique: true }));
    await getClienteCollection().then(col => col.createIndex({ email: 1 }, { unique: true }));
    await getArticulosCollection().then(col => col.createIndex({ nombre: 1 }));
    await getCategoriasCollection().then(col => col.createIndex({ nombre: 1 }));
    await getPedidosCollection().then(col => Promise.all([
      col.createIndex({ usuario: 1 }),
      col.createIndex({ estado: 1 }),
      col.createIndex({ fechaCreacion: -1 })
    ]));
    // Verificar acceso a colecciones
    logger.info('🔍 Probando conexión a colecciones…');
    await getUsuariosCollection().then(() => logger.info('📂 Colección Usuarios OK'));
    await getArticulosCollection().then(() => logger.info('📂 Colección Articulos OK'));
    await getPedidosCollection().then(() => logger.info('📂 Colección Pedidos OK'));
    await getCategoriasCollection().then(() => logger.info('📂 Colección Categorias OK'));
    await getClienteCollection().then(() => logger.info('📂 Colección Clientes OK'));
    await getStatsCollection().then(() => logger.info('📂 Colección Stats OK'));
    await getSalesCollection().then(() => logger.info('📂 Colección Sales OK'));
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Servidor corriendo en puerto ${PORT}`);
      logger.info(`🔗 URL: http://localhost:${PORT}`);
    });

    // Express-winston error logger
    app.use(expressWinston.errorLogger({ winstonInstance: logger }));

    // Cierre suave
    const gracefulShutdown = async () => {
      console.log('🛑 Cerrando servidor...');
      await closeDB();
      server.close(() => {
        console.log('🏁 Servidor cerrado');
        process.exit(0);
      });
    };
    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);

  } catch (error) {
    logger.error('💥 Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

iniciarServidor();

export default app;