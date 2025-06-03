# Backend E-commerce API

## Requisitos
- Node.js >= 18
- MongoDB
- Variables de entorno en `.env`

## Instalación
```sh
npm install
```

## Configuración
Crea un archivo `.env` con los siguientes valores de ejemplo:
```
DB_USER=usuario
DB_PASS=contraseña
DB_HOST=localhost
DB_NAME=mi_base
collection_Users=Usuario
collection_Products=Articulo
collection_Orders=Pedido
collection_Categories=Categoria
collection_Cliente=Cliente
collection_Stats=Stats
collection_Sales=Sales
PORT=3005
CRYPTO_SECRET_KEY=clave_super_secreta
FRONTEND_URL=http://localhost:5173
```

## Inicializar la base de datos con usuario admin y categorías
```sh
npm run seed:admin
```

## Ejecución del servidor
```sh
npm run dev
```

## Documentación Swagger
Accede a la documentación interactiva en:
```
http://localhost:3005/api-docs
```

## Seguridad y buenas prácticas
- Contraseñas hasheadas con bcrypt.
- Campos sensibles cifrados con AES (CryptoJS).
- Validación de entrada con Joi.
- Rotación diaria de logs con winston-daily-rotate-file.
- Índices automáticos en MongoDB para búsquedas y unicidad.

## Scripts útiles
- `npm run seed:admin` — Inserta usuario admin y categorías de ejemplo.

## Estructura principal
- `src/routes/` — Rutas de la API
- `src/controllers/` — Lógica de controladores
- `src/models/` — Modelos y acceso a datos
- `src/services/` — Lógica de negocio
- `src/schemas/` — Esquemas Joi
- `src/middleware/` — Middlewares
- `src/utils/` — Utilidades (logger, cifrado)
- `src/scripts/` — Scripts de inicialización
