# PRISMA v5 - Sistema de Presentaciones Interactivas

> Sistema completo B2B con IA, Voz y Analytics para presentaciones comerciales inmersivas

## 📋 Resumen Ejecutivo

PRISMA v5 es un sistema de presentaciones comerciales interactivas diseñado para facilitar la venta B2B mediante experiencias inmersivas que combinan contenido visual, inteligencia artificial contextual y funcionalidades de voz avanzadas.

### 🎯 Propósito del Sistema

- **Presentaciones comerciales** para propuestas de proyectos con servicios y precios
- **Experiencia UX/UI de primer nivel** que genere "wow!" y facilite la contratación
- **Filosofía KISS** (Keep It Simple, Stupid) pero con funcionalidades avanzadas
- **Acceso privado y seguro** mediante tokens únicos por cliente

## 🏗️ Arquitectura General

### Stack Tecnológico

#### Backend
```typescript
Runtime: Node.js 20+ LTS
Language: TypeScript 5+
Framework: Express.js + Helmet + CORS
Persistence: JSON File Storage (decisión arquitectónica)
AI: OpenAI/Claude integration
File Storage: Local filesystem
Testing: Jest + Supertest
```

#### Frontend
```typescript
Framework: Next.js 15 + TypeScript
UI Components: Shadcn/ui + Radix UI
Styling: Tailwind CSS
State Management: Zustand
Animations: Framer Motion (mínimas)
Build: Next.js built-in
Testing: Vitest + Testing Library
```

### Estructura del Proyecto

```
prisma-v5/
├── 📁 apps/
│   ├── 📁 backend/              # API Server (Node.js + TypeScript)
│   ├── 📁 frontend-nextjs/      # Presentaciones para clientes
│   └── 📁 backoffice-nextjs/    # Panel administrativo
├── 📁 packages/
│   ├── 📁 shared/               # Tipos TypeScript compartidos
│   └── 📁 utils/                # Utilidades comunes
├── 📁 data/
│   ├── 📁 presentations/        # JSON de presentaciones individuales
│   ├── 📁 users/                # Usuarios del sistema
│   ├── 📁 tokens/               # Tokens de acceso a presentaciones
│   ├── 📁 analytics/            # Eventos de tracking por presentación
│   └── 📁 corpus/               # Base de conocimiento por presentación
├── 📁 docs/                     # Documentación modular
└── 📁 assets/                   # Logos y recursos
```

## 🎭 Componentes Principales

### 1. Backoffice (Panel Administrativo)

Panel de gestión para crear, editar y administrar presentaciones comerciales.

**Funcionalidades:**
- Autenticación con admin/admin123
- CRUD de presentaciones con duplicación
- Editor WYSIWYG estilo Notion/WordPress
- Gestión de tokens de acceso
- Analytics dashboard y hot leads
- Gestión de corpus de conocimiento

### 2. Frontend de Presentaciones (Cliente)

Interfaz inmersiva para visualización de presentaciones comerciales.

**Características:**
- Pantalla completa responsive
- Estilo Apple-like (poco texto, mucho impacto)
- Navegación intuitiva múltiple
- Chat IA contextual integrado
- Sistema de voz (TTS/STT)
- Analytics de engagement

### 3. Backend API

API RESTful con autenticación JWT y persistencia JSON.

**Endpoints principales:**
- `/api/auth` - Autenticación y usuarios
- `/api/presentations` - CRUD de presentaciones
- `/api/analytics` - Tracking y métricas
- `/health` - Health check

## 📚 Documentación Completa

- **[Arquitectura Técnica](./architecture.md)** - Stack, componentes y diseño del sistema
- **[Plan de Fases](./phases.md)** - Roadmap de implementación con validaciones
- **[Decisiones Técnicas](./technical-decisions.md)** - Justificaciones arquitectónicas
- **[API Reference](./api-reference.md)** - Endpoints, tipos y ejemplos

## 🚀 Estado Actual

### ✅ Completado

- **Fase 1**: Fundación y Branding
- **Fase 2**: Backend Core con JSON File Storage

### ⏳ En Progreso

- **Fase 3**: Backoffice Funcional

## 🎯 Configuración de Puertos

- **Frontend (Cliente)**: http://localhost:3001
- **Backoffice (Admin)**: http://localhost:3003  
- **Backend (API)**: http://localhost:3004

## 🔐 Cuentas de Prueba

- **Admin**: admin@prisma.com / admin123
- **Demo**: demo@prisma.com / demo123

---

*Sistema PRISMA v5 - Presentaciones Interactivas del Futuro*
*Documentación v1.3 - Actualizada el 7 de agosto de 2025*
