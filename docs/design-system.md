# Prisma v5 Design System
## Sistema de Diseño para Presentaciones Empresariales

### 🎯 **Filosofía de Diseño**
- **Claridad sobre complejidad**: Información densa pero bien estructurada
- **Consistencia visual**: Elementos reutilizables y predecibles  
- **Flexibilidad controlada**: Templates adaptables sin perder coherencia
- **Escalabilidad**: Sistema que crece con nuevos contenidos

---

## 🎨 **Design Tokens**

### **Colores**
```css
/* Colores Primarios */
--prisma-primary: #bf3e48;           /* Rojo Prisma */
--prisma-primary-hover: #a03441;     /* Rojo Prisma Hover */
--prisma-primary-light: #fdf2f3;     /* Rojo Prisma Light */

/* Colores Neutros */
--prisma-dark: #1a1a1a;              /* Texto principal */
--prisma-gray: #6b7280;              /* Texto secundario */
--prisma-light-gray: #f3f4f6;        /* Fondos suaves */
--prisma-white: #ffffff;             /* Fondos principales */

/* Colores Funcionales */
--prisma-success: #10b981;           /* Éxito/Positivo */
--prisma-warning: #f59e0b;           /* Advertencia */
--prisma-error: #ef4444;             /* Error/Negativo */
--prisma-info: #3b82f6;              /* Información */
```

### **Tipografía**
```css
/* Font Stack */
--prisma-font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

/* Escala Tipográfica */
--text-hero: clamp(3rem, 8vw, 6rem);        /* 48-96px */
--text-title: clamp(2rem, 5vw, 3.5rem);     /* 32-56px */
--text-subtitle: clamp(1.5rem, 3vw, 2rem);  /* 24-32px */
--text-body-large: clamp(1.125rem, 2.5vw, 1.5rem); /* 18-24px */
--text-body: clamp(1rem, 2vw, 1.25rem);     /* 16-20px */
--text-small: clamp(0.875rem, 1.5vw, 1rem); /* 14-16px */
--text-caption: clamp(0.75rem, 1vw, 0.875rem); /* 12-14px */

/* Pesos */
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
```

### **Espaciado**
```css
/* Sistema de Espaciado (8px base) */
--space-xs: 0.25rem;    /* 4px */
--space-sm: 0.5rem;     /* 8px */
--space-md: 1rem;       /* 16px */
--space-lg: 1.5rem;     /* 24px */
--space-xl: 2rem;       /* 32px */
--space-2xl: 3rem;      /* 48px */
--space-3xl: 4rem;      /* 64px */
--space-4xl: 6rem;      /* 96px */
--space-5xl: 8rem;      /* 128px */
```

### **Iconos**
```css
/* Tamaños de Iconos */
--icon-xs: 16px;
--icon-sm: 20px;
--icon-md: 24px;
--icon-lg: 32px;
--icon-xl: 48px;
--icon-2xl: 64px;

/* Variantes */
--icon-variant-outlined: 'Material+Symbols+Outlined';
--icon-variant-two-tone: 'Material+Symbols+Two+Tone';
--icon-variant-filled: 'Material+Symbols+Filled';
```

---

## 📐 **Grid System**

### **Layout Principal**
```css
/* Container Responsivo */
.slide-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-2xl);
}

/* Grid de 12 Columnas */
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-lg);
}

/* Variantes Comunes */
.grid-2-cols { grid-template-columns: 1fr 1fr; }
.grid-3-cols { grid-template-columns: repeat(3, 1fr); }
.grid-4-cols { grid-template-columns: repeat(4, 1fr); }
```

---

## 🧩 **Componentes Base**

### **1. Cards**
```css
.card {
  background: var(--prisma-white);
  border-radius: 12px;
  padding: var(--space-xl);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.card-highlight {
  border: 2px solid var(--prisma-primary);
  position: relative;
}
```

### **2. Buttons**
```css
.btn {
  padding: var(--space-md) var(--space-xl);
  border-radius: 8px;
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-primary {
  background: var(--prisma-primary);
  color: var(--prisma-white);
}

.btn-primary:hover {
  background: var(--prisma-primary-hover);
}
```

### **3. Icons**
```css
.icon {
  font-family: var(--icon-variant-outlined);
  font-size: var(--icon-md);
  color: var(--prisma-primary);
  line-height: 1;
}

.icon-large { font-size: var(--icon-xl); }
.icon-small { font-size: var(--icon-sm); }
```

---

## 📱 **Tipos de Slides**

### **1. Cover Slide**
- **Propósito**: Portada de presentación
- **Elementos**: Título hero, subtítulo, logo, imagen de fondo
- **Layout**: Centrado vertical

### **2. Index Slide** 
- **Propósito**: Tabla de contenidos
- **Elementos**: Lista numerada, navegación
- **Layout**: Lista vertical centrada

### **3. Content Slide**
- **Propósito**: Contenido general
- **Elementos**: Título, texto, bullets, imágenes
- **Layout**: Flexible 1-2 columnas

### **4. Service Grid Slide**
- **Propósito**: Mostrar servicios/productos
- **Elementos**: Grid de cards con iconos
- **Layout**: 2x2 o 3x2 grid

### **5. Pricing Cards Slide**
- **Propósito**: Paquetes y precios
- **Elementos**: Cards comparativas con precios
- **Layout**: 3 columnas horizontales

### **6. Process Flow Slide**
- **Propósito**: Metodologías y procesos
- **Elementos**: Iconos conectados con flechas
- **Layout**: Flow horizontal o vertical

### **7. Metrics Dashboard Slide**
- **Propósito**: KPIs y resultados
- **Elementos**: Números grandes con iconos
- **Layout**: Grid de métricas

### **8. Quote/Testimonial Slide**
- **Propósito**: Testimonios y citas
- **Elementos**: Texto destacado, autor, foto
- **Layout**: Centrado con elementos decorativos

---

## 🎭 **Composiciones Gráficas**

### **Service Grid Composition**
```typescript
interface ServiceGridComposition {
  type: 'service-grid';
  services: {
    icon: string;
    title: string;
    description: string;
    features: string[];
    price?: string;
  }[];
  layout: '2x2' | '3x2' | '4x1';
}
```

### **Pricing Cards Composition**
```typescript
interface PricingCardsComposition {
  type: 'pricing-cards';
  packages: {
    name: string;
    price: string;
    period: string;
    icon: string;
    features: string[];
    highlight: boolean;
    cta: string;
  }[];
}
```

### **Process Flow Composition**
```typescript
interface ProcessFlowComposition {
  type: 'process-flow';
  steps: {
    icon: string;
    title: string;
    description: string;
    position: { x: number; y: number };
  }[];
  connections: {
    from: number;
    to: number;
    type: 'arrow' | 'line';
  }[];
}
```

---

## 🎬 **Animaciones**

### **Entrance Animations**
```css
@keyframes slideInUp {
  from { transform: translateY(30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

### **Hover Effects**
```css
.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.15);
}

.hover-glow:hover {
  box-shadow: 0 0 20px rgba(191, 62, 72, 0.3);
}
```

---

## 📏 **Responsive Breakpoints**

```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

---

## ✅ **Checklist de Implementación**

### **Fase 1: Fundamentos**
- [ ] Implementar design tokens CSS
- [ ] Crear sistema de grid responsivo
- [ ] Definir componentes base (cards, buttons, icons)

### **Fase 2: Composiciones**
- [ ] Desarrollar composiciones gráficas dinámicas
- [ ] Implementar sistema de iconos con Material Symbols
- [ ] Crear templates de slides reutilizables

### **Fase 3: Gestión de Contenido**
- [ ] Backoffice para gestión de servicios
- [ ] Backoffice para gestión de precios
- [ ] Sistema de templates personalizables

### **Fase 4: Optimización**
- [ ] Animaciones y transiciones
- [ ] Performance y carga optimizada
- [ ] Testing en diferentes dispositivos
