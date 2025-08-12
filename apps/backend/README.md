# Prisma v5 Backend

Backend API para el sistema de presentaciones interactivas Prisma v5.

## 🚀 Características

- **Autenticación JWT** - Sistema seguro de login y registro
- **JSON File Storage** - Almacenamiento simple y portable en archivos JSON
- **API RESTful** - Endpoints para presentaciones, usuarios y analytics
- **Middleware de seguridad** - Helmet, CORS, validación
- **Analytics en tiempo real** - Tracking de eventos y métricas
- **Tipos TypeScript** - Completamente tipado
- **Sin dependencias de BD** - Fácil deployment y desarrollo

## 📋 Requisitos

- Node.js 18+
- npm o yarn

**¡No se requiere base de datos!** Los datos se almacenan en archivos JSON.

## ⚙️ Configuración

### 1. Variables de entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env
```

Edita `.env` con tus valores:

```env
# JSON File Storage
# Los datos se almacenan en archivos JSON en src/data/
# No se requiere configuración de base de datos

# JWT Authentication
JWT_SECRET="tu-clave-secreta-super-segura"
JWT_EXPIRES_IN="7d"

# Server
PORT=3004
NODE_ENV="development"

# CORS
CORS_ORIGIN="http://localhost:3001,http://localhost:3003"
```

### 2. Base de datos

Configura PostgreSQL y ejecuta:

```bash
# Generar cliente Prisma
npm run db:generate

# Crear/actualizar esquema en la base de datos
npm run db:push

# Poblar con datos de ejemplo
npm run db:seed
```

### 3. Desarrollo

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

El servidor estará disponible en `http://localhost:3004`

## 🔗 Endpoints API

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Perfil del usuario
- `POST /api/auth/refresh` - Renovar token

### Presentaciones
- `GET /api/presentations` - Listar todas (admin)
- `GET /api/presentations/my` - Mis presentaciones
- `GET /api/presentations/:id` - Obtener presentación
- `GET /api/presentations/public/:token` - Acceso público
- `POST /api/presentations` - Crear presentación
- `PUT /api/presentations/:id` - Actualizar presentación
- `DELETE /api/presentations/:id` - Eliminar presentación
- `POST /api/presentations/:id/duplicate` - Duplicar presentación

### Analytics
- `POST /api/analytics/track` - Registrar evento
- `GET /api/analytics/presentation/:id` - Analytics de presentación
- `GET /api/analytics/user/overview` - Resumen del usuario
- `POST /api/analytics/session` - Gestionar sesión

## 🧪 Cuentas de prueba

Después de ejecutar `npm run db:seed`:

- **Admin**: `admin@prisma.com` / `admin123`
- **Demo**: `demo@prisma.com` / `demo123`

## 📊 Scripts disponibles

```bash
npm run dev          # Desarrollo con hot reload
npm run build        # Compilar para producción
npm run start        # Ejecutar versión compilada
npm run db:generate  # Generar cliente Prisma
npm run db:push      # Actualizar esquema DB
npm run db:migrate   # Crear migración
npm run db:studio    # Abrir Prisma Studio
npm run db:seed      # Poblar base de datos
npm run db:reset     # Resetear y poblar DB
```

## 🏗️ Estructura del proyecto

```
src/
├── lib/           # Utilidades (Prisma, JWT)
├── middleware/    # Middleware de Express
├── routes/        # Rutas de la API
├── types/         # Tipos TypeScript
├── scripts/       # Scripts de utilidad
└── index.ts       # Servidor principal

prisma/
└── schema.prisma  # Esquema de base de datos
```

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt
- Tokens JWT seguros
- Middleware Helmet para headers de seguridad
- Validación de entrada en todos los endpoints
- CORS configurado para dominios específicos

## 📈 Monitoreo

- Health check en `/health`
- Logs de requests en desarrollo
- Manejo de errores centralizado
- Desconexión graceful de la base de datos

---

**TodoSeTransforma by Digitis** ✨
