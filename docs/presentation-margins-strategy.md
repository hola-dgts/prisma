# Estrategia de Márgenes de Seguridad - Prisma v5 Presentations

## 📋 Resumen de la Estrategia v4 Implementada

La estrategia de márgenes de seguridad de Prisma v5 sigue el enfoque exitoso de v4, con mejoras específicas para diferentes dispositivos y casos de uso.

## 🎯 Principios Fundamentales

### 1. **Márgenes de Seguridad Responsivos**
- **Desktop (≥1200px)**: Márgenes generosos para legibilidad óptima
- **Desktop Medio (1024-1199px)**: Márgenes estándar balanceados
- **Tablet (769-1023px)**: Márgenes reducidos pero seguros
- **Mobile (≤768px)**: Márgenes mínimos + scroll permitido

### 2. **Gestión de Desbordamiento por Dispositivo**

#### Desktop y Tablet
- ✅ Contenido debe caber en pantalla sin scroll
- ✅ Márgenes de seguridad garantizados
- ✅ Tipografía fluida con `clamp()` para adaptación

#### Mobile
- ✅ **Scroll vertical permitido** (estrategia v4)
- ✅ Márgenes mínimos de seguridad (1rem-1.5rem)
- ✅ Altura flexible para contenido largo
- ✅ Contenido puede desbordarse verticalmente

## 📐 Implementación Técnica

### Breakpoints y Márgenes

```css
/* Desktop Grande (≥1200px) */
.prisma-slide__body {
  padding: clamp(3rem, 6vw, 5rem);
}

/* Desktop Medio (1024-1199px) */
.prisma-slide__body {
  padding: clamp(2.5rem, 5vw, 4rem);
}

/* Tablet (769-1023px) */
.prisma-slide__body {
  padding: clamp(2rem, 4vw, 3rem);
}

/* Mobile (≤768px) - SCROLL PERMITIDO */
.prisma-slide__body {
  padding: clamp(1rem, 3vw, 1.5rem);
  overflow-y: auto;
  overflow-x: hidden;
  min-height: calc(100vh - 60px);
  height: auto;
}
```

### Contenedores de Slides

Los contenedores específicos de cada tipo de slide **NO** definen padding propio, sino que confían en los márgenes de seguridad del sistema base:

```css
.prisma-cover__container {
  /* ❌ NO: padding: clamp(2rem, 5vw, 4rem); */
  /* ✅ SÍ: Padding gestionado por .prisma-slide__body */
  max-width: 1200px;
  margin: 0 auto;
}
```

## 🔄 Comportamiento por Tipo de Contenido

### Slides Centrados (cover, section_index, closing)
- Contenido centrado vertical y horizontalmente
- Márgenes de seguridad aplicados uniformemente
- En mobile: scroll si el contenido es muy alto

### Slides de Contenido (content, keypoints, metrics)
- Alineación superior para lectura natural
- Márgenes de seguridad laterales consistentes
- En mobile: scroll natural para listas largas

### Slides de Media (image, video)
- Márgenes reducidos para maximizar área visual
- Contenido centrado con espacio de respiro
- En mobile: márgenes mínimos (0.5rem-1rem)

## 📱 Estrategia Mobile Específica

### Diferencias clave con Desktop:
1. **Scroll Permitido**: El contenido puede desbordarse verticalmente
2. **Márgenes Mínimos**: Solo lo necesario para evitar cortes
3. **Altura Flexible**: `height: auto` permite contenido largo
4. **Overflow Visible**: El contenedor principal permite desbordamiento

### Implementación Mobile:
```css
@media (max-width: 768px) {
  .prisma-slide {
    min-height: 100vh;
    height: auto;           /* ← Altura flexible */
    overflow: visible;      /* ← Permite desbordamiento */
  }
  
  .prisma-presentation {
    overflow: visible;      /* ← Contenedor permite scroll */
  }
  
  .prisma-slide__body {
    overflow-y: auto;       /* ← Scroll vertical habilitado */
    overflow-x: hidden;     /* ← Sin scroll horizontal */
  }
}
```

## ✅ Ventajas de esta Estrategia

1. **Consistencia**: Márgenes unificados en todo el sistema
2. **Responsividad**: Adaptación fluida a diferentes pantallas
3. **Usabilidad Mobile**: Scroll natural para contenido largo
4. **Mantenibilidad**: Lógica centralizada en base.css
5. **Flexibilidad**: Cada tipo de slide se adapta automáticamente

## 🚨 Casos Especiales

### Contenido Muy Largo en Desktop
- La tipografía fluida con `clamp()` se adapta automáticamente
- Si aún así no cabe, considerar dividir en múltiples slides

### Imágenes y Videos
- Márgenes reducidos para maximizar área visual
- Mantienen proporción y centrado
- En mobile: márgenes mínimos pero seguros

### Tablas y Datos Complejos
- En desktop: deben caber en pantalla
- En mobile: scroll horizontal controlado si es necesario
- Considerar versiones simplificadas para mobile

## 🔧 Debugging y Verificación

Para verificar que los márgenes funcionan correctamente:

1. **Desktop**: Contenido debe verse completo sin scroll
2. **Tablet**: Márgenes visibles, contenido legible
3. **Mobile**: Márgenes mínimos, scroll disponible si necesario
4. **Transiciones**: Márgenes se adaptan suavemente entre breakpoints

Esta estrategia garantiza una experiencia óptima en todos los dispositivos, manteniendo la filosofía v4 de márgenes inteligentes y scroll selectivo.
