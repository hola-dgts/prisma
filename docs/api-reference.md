# API Reference - PRISMA v5

> Documentación completa de endpoints, tipos y ejemplos

---

## 🔗 Base URL

```
http://localhost:3004/api
```

---

## 🔐 Autenticación

### POST /auth/login

Autenticación de usuario administrador.

**Request:**
```typescript
{
  "email": "admin@prisma.com",
  "password": "admin123"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "user": {
      "id": "user-1",
      "email": "admin@prisma.com",
      "name": "Administrator",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST /auth/register

Registro de nuevo usuario.

**Request:**
```typescript
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

### GET /auth/me

Obtener perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "id": "user-1",
    "email": "admin@prisma.com",
    "name": "Administrator",
    "role": "ADMIN",
    "createdAt": "2025-08-07T19:00:00.000Z"
  }
}
```

### POST /auth/refresh

Renovar token de acceso.

---

## 📊 Presentaciones

### GET /presentations

Listar todas las presentaciones.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```typescript
{
  "success": true,
  "data": [
    {
      "id": "pres-1",
      "title": "Propuesta Comercial - Cliente ABC",
      "description": "Presentación para proyecto de transformación digital",
      "status": "PUBLISHED",
      "accessToken": "abc123def456",
      "createdAt": "2025-08-07T19:00:00.000Z",
      "updatedAt": "2025-08-07T19:30:00.000Z",
      "author": {
        "id": "user-1",
        "name": "Administrator",
        "email": "admin@prisma.com"
      }
    }
  ]
}
```

### POST /presentations

Crear nueva presentación.

**Request:**
```typescript
{
  "title": "Nueva Presentación",
  "description": "Descripción opcional",
  "content": {
    "slides": [
      {
        "id": 1,
        "type": "cover",
        "title": "Título Principal",
        "subtitle": "Subtítulo de la presentación",
        "author": "Autor"
      }
    ],
    "settings": {
      "theme": "prisma",
      "autoAdvance": false,
      "showProgress": true
    }
  }
}
```

### GET /presentations/:id

Obtener presentación específica.

**Response:**
```typescript
{
  "success": true,
  "data": {
    "id": "pres-1",
    "title": "Propuesta Comercial",
    "content": {
      "slides": [...],
      "settings": {...}
    },
    "status": "PUBLISHED",
    "accessToken": "abc123def456",
    "author": {...}
  }
}
```

### PUT /presentations/:id

Actualizar presentación existente.

### DELETE /presentations/:id

Eliminar presentación.

### POST /presentations/:id/duplicate

Duplicar presentación existente.

**Response:**
```typescript
{
  "success": true,
  "data": {
    "id": "pres-2",
    "title": "Copia de Propuesta Comercial",
    "content": {...},
    "status": "DRAFT"
  }
}
```

### GET /presentations/public/:token

Acceso público a presentación con token.

**Response:**
```typescript
{
  "success": true,
  "data": {
    "presentation": {
      "id": "pres-1",
      "title": "Propuesta Comercial",
      "content": {...}
    },
    "permissions": {
      "canDownload": true,
      "canShare": false,
      "expiresAt": "2025-08-14T19:00:00.000Z"
    }
  }
}
```

---

## 📈 Analytics

### POST /analytics/track

Registrar evento de analytics.

**Request:**
```typescript
{
  "presentationId": "pres-1",
  "sessionId": "session-123",
  "eventType": "SLIDE_VIEW",
  "eventData": {
    "slideId": 1,
    "timeSpent": 15000,
    "timestamp": "2025-08-07T19:15:00.000Z"
  },
  "userAgent": "Mozilla/5.0...",
  "ipAddress": "192.168.1.1"
}
```

### GET /analytics/:presentationId

Obtener métricas de presentación.

**Response:**
```typescript
{
  "success": true,
  "data": {
    "presentationId": "pres-1",
    "totalViews": 45,
    "uniqueViewers": 12,
    "averageTimeSpent": 180000,
    "completionRate": 0.75,
    "slideMetrics": [
      {
        "slideId": 1,
        "views": 45,
        "averageTime": 25000,
        "bounceRate": 0.1
      }
    ],
    "engagementScore": 0.87
  }
}
```

### GET /analytics/user/:userId

Obtener resumen de analytics por usuario.

### POST /analytics/session

Crear nueva sesión de analytics.

---

## 🏥 Health Check

### GET /health

Verificar estado del servidor.

**Response:**
```typescript
{
  "status": "ok",
  "timestamp": "2025-08-07T19:00:00.000Z",
  "uptime": 3600,
  "version": "1.0.0"
}
```

---

## 📝 Tipos TypeScript

### User

```typescript
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'ADMIN' | 'USER';
  createdAt: string;
  updatedAt: string;
}
```

### Presentation

```typescript
interface Presentation {
  id: string;
  title: string;
  description?: string;
  content: PresentationContent;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  accessToken?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

interface PresentationContent {
  slides: Slide[];
  settings: PresentationSettings;
}

interface Slide {
  id: number;
  type: SlideType;
  title: string;
  subtitle?: string;
  content?: string;
  author?: string;
  blocks?: Block[];
  background?: SlideBackground;
  layout?: SlideLayout;
}

type SlideType = 
  | 'cover' 
  | 'index' 
  | 'section_index' 
  | 'content' 
  | 'highlight' 
  | 'keypoints' 
  | 'metrics' 
  | 'quote' 
  | 'image' 
  | 'video' 
  | 'closing';
```

### Analytics

```typescript
interface AnalyticsEvent {
  presentationId: string;
  sessionId?: string;
  eventType: AnalyticsEventType;
  eventData?: any;
  userAgent?: string;
  ipAddress?: string;
  timestamp: string;
}

type AnalyticsEventType = 
  | 'PRESENTATION_START'
  | 'PRESENTATION_END'
  | 'SLIDE_VIEW'
  | 'SLIDE_CHANGE'
  | 'CHAT_MESSAGE'
  | 'VOICE_INTERACTION'
  | 'CTA_CLICK'
  | 'DOWNLOAD'
  | 'SHARE';

interface PresentationAnalytics {
  presentationId: string;
  totalViews: number;
  uniqueViewers: number;
  averageTimeSpent: number;
  completionRate: number;
  slideMetrics: SlideMetrics[];
  engagementScore: number;
  hotLeads: HotLead[];
}
```

### API Response

```typescript
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
}
```

---

## 🔒 Autenticación JWT

### Token Structure

```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: 'ADMIN' | 'USER';
  iat: number;
  exp: number;
}
```

### Headers Required

```typescript
{
  "Authorization": "Bearer <jwt_token>",
  "Content-Type": "application/json"
}
```

---

## 🚨 Error Codes

| Code | Description |
|------|-------------|
| `AUTH_REQUIRED` | Autenticación requerida |
| `INVALID_TOKEN` | Token JWT inválido |
| `INSUFFICIENT_PERMISSIONS` | Permisos insuficientes |
| `RESOURCE_NOT_FOUND` | Recurso no encontrado |
| `VALIDATION_ERROR` | Error de validación |
| `INTERNAL_ERROR` | Error interno del servidor |

### Error Response Format

```typescript
{
  "success": false,
  "error": {
    "message": "Token JWT inválido",
    "code": "INVALID_TOKEN",
    "details": {
      "field": "authorization",
      "reason": "Token expired"
    }
  }
}
```

---

## 🧪 Ejemplos de Uso

### Crear y Acceder a Presentación

```typescript
// 1. Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@prisma.com',
    password: 'admin123'
  })
});

const { data: { token } } = await loginResponse.json();

// 2. Crear presentación
const presentationResponse = await fetch('/api/presentations', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Mi Presentación',
    content: {
      slides: [
        {
          id: 1,
          type: 'cover',
          title: 'Título Principal'
        }
      ],
      settings: {
        theme: 'prisma'
      }
    }
  })
});

// 3. Acceso público
const publicResponse = await fetch(`/api/presentations/public/${accessToken}`);
const presentation = await publicResponse.json();
```

---

*API Reference v1.3 - Actualizado el 7 de agosto de 2025*
