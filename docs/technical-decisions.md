# Decisiones Técnicas - PRISMA v5

> Justificaciones arquitectónicas y decisiones de diseño

---

## 🏛️ JSON File Storage vs Base de Datos

### Decisión Adoptada

**Se decidió utilizar archivos JSON en lugar de PostgreSQL + Prisma ORM** para la persistencia de datos.

### Análisis de Compatibilidad

✅ **Compatible con todas las funcionalidades planificadas:**

- **Editor WYSIWYG**: Slides se guardan como JSON estructurado
- **Gestión de presentaciones**: CRUD simple con archivos individuales
- **Sistema de tokens**: Metadatos de acceso en archivos JSON
- **Analytics básicos**: Eventos por presentación en archivos JSON
- **Corpus de conocimiento**: Archivos de texto/JSON por presentación

### Justificación Técnica

```typescript
interface AnalysisFactors {
  volumeData: "Bajo (uso B2B, pocas presentaciones simultáneas)";
  usagePattern: "Lectura-intensiva (presentaciones se leen más que escriben)";
  concurrency: "Baja (pocos usuarios simultáneos por presentación)";
  operations: "CRUD simples (sin consultas complejas SQL)";
  transactions: "No requiere ACID (operaciones atómicas simples)";
}
```

### Ventajas Específicas para Prisma v5

- **Simplicidad**: Sin configuración de PostgreSQL, migraciones, etc.
- **Portabilidad**: Backup y migración de datos trivial
- **Desarrollo rápido**: Sin dependencias de base de datos externa
- **Debugging directo**: Archivos JSON legibles y editables
- **Versionado**: Datos pueden versionarse con Git si es necesario
- **Deployment simple**: Sin infraestructura de base de datos

### Limitaciones que NO Afectan al Proyecto

- ❌ Consultas SQL complejas (no necesarias para este caso de uso)
- ❌ Transacciones ACID (operaciones simples y atómicas)
- ❌ Concurrencia alta (uso B2B con pocos usuarios simultáneos)
- ❌ Escalabilidad masiva (no requerida para el modelo de negocio)

### Estructura de Archivos Implementada

```
data/
├── presentations/
│   ├── pres-001.json          # Presentación individual
│   ├── pres-002.json
│   └── index.json             # Índice de presentaciones
├── users/
│   └── users.json             # Usuarios del sistema
├── tokens/
│   └── tokens.json            # Tokens de acceso
├── analytics/
│   ├── pres-001-events.json   # Eventos por presentación
│   └── pres-002-events.json
└── corpus/
    ├── pres-001/              # Archivos de conocimiento
    └── pres-002/
```

### Criterios para Migrar a Base de Datos (Futuro)

Si el proyecto evoluciona y presenta:

- Más de 100 presentaciones simultáneas
- Más de 50 usuarios concurrentes por presentación
- Necesidad de consultas complejas o reportes avanzados
- Requerimientos de transacciones complejas
- Problemas de performance en operaciones de lectura/escritura

Entonces se evaluará migración a PostgreSQL + Prisma ORM.

### Implementación Técnica

```typescript
// Utilidad genérica para persistencia JSON
class FileStorage<T> {
  private filePath: string;
  
  constructor(filePath: string) {
    this.filePath = filePath;
  }
  
  async read(): Promise<T[]> {
    // Leer archivo JSON con manejo de errores
    if (!fs.existsSync(this.filePath)) {
      return [];
    }
    const data = await fs.readFile(this.filePath, 'utf-8');
    return JSON.parse(data);
  }
  
  async write(data: T[]): Promise<void> {
    // Escribir archivo JSON con formato
    const dir = path.dirname(this.filePath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }
  
  async findById(id: string): Promise<T | null> {
    const data = await this.read();
    return data.find((item: any) => item.id === id) || null;
  }
  
  async create(item: Omit<T, 'id'>): Promise<T> {
    const data = await this.read();
    const newItem = { ...item, id: generateId() } as T;
    data.push(newItem);
    await this.write(data);
    return newItem;
  }
  
  async update(id: string, updates: Partial<T>): Promise<T | null> {
    const data = await this.read();
    const index = data.findIndex((item: any) => item.id === id);
    if (index === -1) return null;
    
    data[index] = { ...data[index], ...updates };
    await this.write(data);
    return data[index];
  }
  
  async delete(id: string): Promise<boolean> {
    const data = await this.read();
    const index = data.findIndex((item: any) => item.id === id);
    if (index === -1) return false;
    
    data.splice(index, 1);
    await this.write(data);
    return true;
  }
}
```

---

## 🎨 Lucide React vs SF Symbols

### Decisión Adoptada

**Se decidió usar Lucide React** para todos los iconos de UI del sistema.

### Justificación

- **Mejor integración**: Componentes React nativos con TypeScript
- **Performance superior**: Sin carga de fuentes externas, tree shaking
- **Mantenimiento activo**: Comunidad activa y actualizaciones regulares
- **Estilo consistente**: Minimalista, apropiado para UI neutra

### Implementación

```typescript
// UI del sistema: Lucide React
import { 
  Home, Settings, User, BarChart3, Plus, Trash2,
  Eye, MessageCircle, Mic, Download, Edit, Save
} from 'lucide-react';

// Iconos de presentaciones: Material Design Two Tone (se mantiene)
import { BusinessTwoTone, TrendingUpTwoTone } from '@mui/icons-material';
```

---

## 🎯 Next.js 15 + Turbopack

### Decisión Adoptada

**Se adoptó Next.js 15 con Turbopack** para frontend y backoffice.

### Justificación

- **Performance**: Turbopack ofrece builds 10x más rápidos que Webpack
- **Developer Experience**: Hot reload instantáneo, mejor debugging
- **Stack moderno**: TypeScript nativo, React 18, App Router
- **Ecosistema**: Compatibilidad total con Shadcn/ui y Tailwind CSS

### Configuración

```typescript
// next.config.js
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
};
```

---

## 🔐 JWT vs Sessions

### Decisión Adoptada

**Se implementó autenticación JWT** para el sistema.

### Justificación

- **Stateless**: No requiere almacenamiento de sesiones en servidor
- **Escalabilidad**: Compatible con arquitecturas distribuidas
- **Flexibilidad**: Tokens pueden incluir metadatos (roles, permisos)
- **Seguridad**: Tokens firmados y con expiración configurable

### Implementación

```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: 'ADMIN' | 'USER';
  iat: number;
  exp: number;
}

// Generación de tokens
const token = jwt.sign(
  { userId, email, role },
  process.env.JWT_SECRET!,
  { expiresIn: '24h' }
);
```

---

## 🎨 Branding: "Prisma" vs "PRISMA"

### Decisión Adoptada

**Se corrigió de "PRISMA" a "Prisma"** en todos los contextos de UI.

### Justificación

- **Profesionalismo**: Capitalización apropiada es más profesional
- **Legibilidad**: "Prisma" es más legible que "PRISMA" en mayúsculas
- **Consistencia**: Alineado con estándares de branding moderno
- **Identidad visual**: Mantiene impacto sin ser agresivo

### Implementación

```typescript
// Headers y títulos
"Prisma"           // ✅ Correcto
"PRISMA"           // ❌ Anterior

// Contenido descriptivo
"sistema Prisma"   // ✅ Correcto
"sistema PRISMA"   // ❌ Anterior
```

---

## 📦 Monorepo con Turborepo

### Decisión Adoptada

**Se implementó monorepo con Turborepo** para gestionar las aplicaciones.

### Justificación

- **Gestión unificada**: Un solo repositorio para backend, frontend y backoffice
- **Compartir código**: Tipos TypeScript y utilidades compartidas
- **Builds optimizados**: Cache inteligente y builds paralelos
- **Developer Experience**: Comandos unificados y configuración centralizada

### Estructura

```
prisma-v5/
├── apps/
│   ├── backend/           # Express API
│   ├── frontend/          # Cliente Next.js
│   └── backoffice/        # Admin Next.js
├── packages/
│   ├── shared/            # Tipos compartidos
│   └── utils/             # Utilidades comunes
└── turbo.json             # Configuración Turborepo
```

---

*Decisiones Técnicas v1.3 - Actualizado el 7 de agosto de 2025*
