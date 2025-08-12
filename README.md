# PRISMA v5 - Sistema de Presentaciones Interactivas

> Sistema completo B2B con IA, Voz y Analytics para presentaciones comerciales inmersivas

## 📚 Documentación Completa

Ver la carpeta [`/docs`](./docs/) para documentación técnica detallada:

- **[README.md](./docs/README.md)** - Resumen ejecutivo y visión general
- **[Arquitectura Técnica](./docs/architecture.md)** - Stack, componentes y diseño del sistema
- **[Plan de Fases](./docs/phases.md)** - Roadmap de implementación con validaciones
- **[Decisiones Técnicas](./docs/technical-decisions.md)** - Justificaciones arquitectónicas
- **[API Reference](./docs/api-reference.md)** - Endpoints, tipos y ejemplos

## 🚀 Quick Start

---

## 🔐 Acceso al Repositorio (GitHub)

Este proyecto utiliza un repositorio privado de GitHub. Para clonar y hacer push/pull necesitas un **Personal Access Token (classic)** con el scope `repo`.

**Usuario del repositorio:** `hola-dgts`

**Cómo usar el token:**

1. **Guarda el token en una variable de entorno local:**
   
   ```sh
   export GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   *(Nunca publiques tu token real en el código ni en la documentación)*

2. **Clona el repositorio usando HTTPS:**
   
   ```sh
   git clone https://hola-dgts:${GITHUB_TOKEN}@github.com/hola-dgts/prisma.git
   ```

   O configura el remote después de clonar:
   
   ```sh
   git remote set-url origin https://hola-dgts:${GITHUB_TOKEN}@github.com/hola-dgts/prisma.git
   ```

3. **Push/pull usando el token:**
   
   Git usará el token como contraseña cuando se lo pida.

> **Importante:**
> - El token debe tener el scope `repo` para acceso completo.
> - No subas el token a ningún archivo del repositorio.
> - Si el token se filtra, revócalo inmediatamente en GitHub.

---

### Prerrequisitos
- Node.js 20+ LTS
- npm o yarn

### Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp apps/backend/.env.example apps/backend/.env
```

### Desarrollo

```bash
# Ejecutar todas las aplicaciones
npm run dev

# O ejecutar individualmente:
npm run dev:backend    # API en puerto 3004
npm run dev:frontend   # Cliente en puerto 3001
npm run dev:backoffice # Admin en puerto 3003
```

### URLs de Desarrollo

- **Frontend (Cliente)**: http://localhost:3001
- **Backoffice (Admin)**: http://localhost:3003  
- **Backend (API)**: http://localhost:3004

### Cuentas de Prueba

- **Admin**: admin@prisma.com / admin123
- **Demo**: demo@prisma.com / demo123

## 🏗️ Arquitectura

### Puertos fijos por aplicación (Monorepo)

| App         | Ruta local           | Puerto fijo |
|-------------|----------------------|-------------|
| Backend     | apps/backend         | 3004        |
| Frontend    | apps/frontend        | 3001        |
| Backoffice  | apps/backoffice      | 3003        |
| Documentación | docusaurus-site    | 3000        |

**Importante:**
- Cada app debe arrancarse SIEMPRE en su puerto correspondiente.
- Si cambias el puerto de alguna app, actualiza esta tabla y la configuración.
- Los endpoints y rutas principales están documentados en cada subproyecto.

### Monorepo Structure

```
prisma-v5/
├── 📁 apps/
│   ├── 📁 backend/              # API Server (Express + TypeScript)
│   ├── 📁 frontend/             # Cliente (Next.js + Shadcn/ui)
│   └── 📁 backoffice/           # Admin (Next.js + Dashboard)
├── 📁 packages/
│   ├── 📁 shared/               # Tipos TypeScript compartidos
│   └── 📁 utils/                # Utilidades comunes
├── 📁 docs/                     # Documentación modular
├── 📁 assets/                   # Logos y recursos
└── 📁 data/                     # Persistencia JSON (desarrollo)
```

### Stack Tecnológico

- **Backend**: Node.js + TypeScript + Express + JSON File Storage
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS + Shadcn/ui
- **Build System**: Turborepo + Turbopack
- **Icons**: Lucide React (UI) + Material Design Two Tone (Presentaciones)
- **Authentication**: JWT
- **AI Integration**: Claude/OpenAI (planificado)

## 🎯 Estado del Proyecto

### ✅ Completado

- **Fase 1**: Fundación y Branding
- **Fase 2**: Backend Core con JSON File Storage

### ⏳ En Progreso

- **Fase 3**: Backoffice Funcional

## 🛠️ Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Todas las apps
npm run dev:backend      # Solo backend
npm run dev:frontend     # Solo frontend
npm run dev:backoffice   # Solo backoffice

# Build
npm run build            # Build todas las apps
npm run build:backend    # Build backend
npm run build:frontend   # Build frontend
npm run build:backoffice # Build backoffice

# Backend específicos
npm run backend:seed     # Poblar datos de ejemplo
npm run backend:dev      # Desarrollo con nodemon
```

## 🔧 Configuración

### Variables de Entorno (Backend)

```bash
# Database
DATABASE_URL="file:./dev.db"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="24h"

# CORS
CORS_ORIGIN="http://localhost:3001,http://localhost:3003"

# Server
PORT=3004
NODE_ENV="development"
```

## 🎨 Branding

### Colores PRISMA

- **Rojo principal**: #DC2626
- **Rojo hover**: #B91C1C  
- **Rojo claro**: #FEE2E2
- **Neutros**: #FAFAFA, #F5F5F5, #E5E5E5, #262626, #171717

### Logos

- **Logo principal**: `assets/prisma-logo.svg`
- **Logo Digitis**: `assets/digitis-logo.svg` (footer)
- **Favicon**: `assets/favicon.ico`

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es propiedad de **Digitis** y está protegido por derechos de autor.
**KISS** - Keep It Simple, Stupid. Clean, maintainable, and effective code.

---

**TodoSeTransforma** - Everything transforms with PRISMA v5 ✨
