# UI/UX Design System - PRISMA v5

> Filosofía de diseño premium basada en Apple Liquid Glass

## 🎨 Filosofía de Diseño

### Principios Fundamentales

#### Apple Liquid Glass Philosophy

- **Material Dinámico Real**: Interfaces que se comportan como vidrio líquido
- **Técnica de Lensing**: Dobla luz digitalmente en tiempo real
- **Adaptabilidad Contextual**: Responde a contenido, orientación y preferencias del usuario
- **Accesibilidad por Defecto**: Se adapta automáticamente a configuraciones de accesibilidad
- **Calm Technology**: Interfaces que susurran en lugar de gritar

### Diferencias con Glassmorphism Tradicional

| Glassmorphism | Apple Liquid Glass |
|---------------|-------------------|
| Efectos estáticos | Material dinámico real |
| Blur y transparencia fijos | Respuesta en tiempo real |
| Puramente estético | Funcional y adaptativo |
| Sin contexto | Conciencia contextual |

---

## 🛠️ Stack Tecnológico

### Frontend (Presentaciones Públicas)
- **Framework**: Next.js 15 + React 19 + TypeScript 5
- **Styling**: Tailwind CSS 4 + CSS Custom Properties
- **Iconos**: Heroicons + Lucide React
- **Animaciones**: CSS Transitions + Framer Motion (futuro)
- **Efectos**: backdrop-filter + CSS transforms

### Backoffice (Administración)
- **Framework**: Next.js 15 + React 19 + TypeScript 5
- **Styling**: Tailwind CSS 4
- **Iconos**: Heroicons + Lucide React
- **Componentes**: Headless UI (futuro)
- **Estado**: React Hooks + Context API

---

## 🎯 Análisis de Prisma v4

### Sistema de Toolbar Analizado

#### Estructura Dual de Navegación
```javascript
// Navegación Normal (modo manual)
const normalNav = createElement('div', 'prisma-nav-new__normal');
// Contiene: [◀️] [1/10] [▶️]

// Navegación Narrada (modo presentación)
const narratedNav = createElement('div', 'prisma-nav-new__narrated');
// Contiene: [1/10] [✋ Mano]
```

#### Lógica de Mutación de Modos
```javascript
updateNewToolbarState() {
    const isPresenting = Prisma.voice?.state?.isPresenting;
    const presentationMode = Prisma.state.presentation.mode;
    
    if (isPresenting && presentationMode === 'narrated') {
        // MODO NARRADO: Ocultar navegación manual, mostrar mano
        normalNav.style.display = 'none';
        narratedNav.style.display = 'flex';
    } else {
        // MODO NORMAL: Mostrar navegación manual, ocultar mano
        normalNav.style.display = 'flex';
        narratedNav.style.display = 'none';
    }
}
```

#### Sistema Auto-Hide Inteligente
```javascript
// Configuración
autoHideDelay: 6000 // 6 segundos
// Solo activo en desktop (window.innerWidth > 768)

// Detección de actividad
setupAutoHide() {
    // Detectar movimiento del mouse
    document.addEventListener('mousemove', () => {
        this.updateActivity();
    });
    
    // Timer de verificación cada segundo
    setInterval(() => {
        const inactive = (Date.now() - lastActivity) > autoHideDelay;
        this.setUIVisibility(!inactive);
    }, 1000);
}
```

#### Estados de Botones
```javascript
// Botón de Voz
// Normal: play_circle → "Presentar (V)"
// Presentando: stop_circle → "Detener presentación (V)"

// Botón de Mano
// Normal: pan_tool (sin clases)
// Mano Levantada: pan_tool + .hand-raised
// Escuchando: mic + .listening
```

---

## 🏗️ Arquitectura de Componentes v5

### Frontend - Presentaciones Públicas

#### Estructura de Componentes
```
src/components/ui/presentation/
├── PresentationToolbar.tsx     # Toolbar principal con Liquid Glass
├── NavigationPill.tsx          # Navegación dual (manual/narrada)
├── ToolbarButton.tsx           # Botones reutilizables con estados
├── LiquidGlassContainer.tsx    # Contenedor base con efectos
├── AutoHideWrapper.tsx         # Wrapper para auto-hide logic
└── hooks/
    ├── useAutoHide.ts          # Auto-hide inteligente
    ├── useToolbarState.ts      # Estado de toolbar y modos
    ├── useLiquidGlass.ts       # Efectos dinámicos
    └── useKeyboardShortcuts.ts # Atajos de teclado
```

#### Componente Principal: PresentationFooter
```tsx
interface ToolbarState {
  mode: 'manual' | 'narrated';
  isPresenting: boolean;
  handState: 'normal' | 'raised' | 'listening';
  uiVisible: boolean;
  currentSlide: number;
  totalSlides: number;
  menuOpen: boolean;
}

const PresentationFooter: React.FC = () => {
  const [state, setState] = useState<ToolbarState>()
  const isVisible = useAutoHide(6000)
  const { displayTitle } = useResponsiveTitle(presentationTitle)
  
  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 p-6 pointer-events-none">
        <div className="flex items-end justify-between max-w-screen-xl mx-auto">
          
          {/* Menú + Título */}
          <LiquidGlassCard className="pointer-events-auto flex items-center gap-3 max-w-md">
            <ToolbarButton 
              icon={Bars3Icon} 
              onClick={toggleMenu}
              className="flex-shrink-0"
            />
            <div className="min-w-0 flex-1 py-2 pr-3">
              <div 
                className="text-sm font-medium text-gray-700 truncate"
                title={presentationTitle}
              >
                {displayTitle}
              </div>
            </div>
          </LiquidGlassCard>
          
          {/* Toolbar de Controles */}
          <LiquidGlassPill className="pointer-events-auto">
            <ToolbarButton icon={HomeIcon} onClick={goHome} />
            <NavigationGroup mode={state.mode} />
            <ToolbarButton 
              icon={state.isPresenting ? StopIcon : PlayIcon}
              onClick={togglePresentation}
              variant="primary"
            />
            <ToolbarButton 
              icon={state.handState === 'listening' ? MicrophoneIcon : HandRaisedIcon}
              disabled={state.mode === 'manual'}
              variant={state.handState !== 'normal' ? 'active' : 'default'}
            />
          </LiquidGlassPill>
          
          {/* Chat */}
          <LiquidGlassButton className="pointer-events-auto">
            <ChatBubbleLeftIcon className="w-5 h-5" />
          </LiquidGlassButton>
        </div>
      </div>
      
      <SlidesSidebar 
        open={state.menuOpen}
        slides={slides}
        currentSlide={state.currentSlide}
        onSlideSelect={navigateToSlide}
        onClose={closeMenu}
      />
    </>
  )
}
```

#### Componente: NavigationGroup (Estable)
```tsx
const NavigationGroup: React.FC<{ mode: 'manual' | 'narrated' }> = ({ mode }) => {
  return (
    <div className="flex items-center gap-1 px-2 min-w-[120px]">
      <ToolbarButton 
        icon={ChevronLeftIcon}
        disabled={mode === 'narrated'}
        className={cn(
          "transition-opacity duration-200",
          mode === 'narrated' ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
        )}
      />
      <span className="px-2 text-sm font-medium min-w-[40px] text-center">
        {currentSlide + 1}/{totalSlides}
      </span>
      <ToolbarButton 
        icon={ChevronRightIcon}
        disabled={mode === 'narrated'}
        className={cn(
          "transition-opacity duration-200",
          mode === 'narrated' ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
        )}
      />
    </div>
  )
}
```

#### Hook: useResponsiveTitle
```tsx
const useResponsiveTitle = (title: string) => {
  const [isMobile, setIsMobile] = useState(false)
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  const truncate = (str: string, length: number) => {
    return str.length > length ? str.substring(0, length) + '...' : str
  }
  
  return {
    displayTitle: isMobile ? truncate(title, 20) : truncate(title, 40),
    showFullTitle: !isMobile,
    isMobile
  }
}
```

#### Componente: SlidesSidebar (Menú Lateral)
```tsx
interface Slide {
  id: string;
  title: string;
  type: 'title' | 'content' | 'image' | 'video';
  thumbnail?: string;
  duration?: number;
}

interface SlidesSidebarProps {
  open: boolean;
  slides: Slide[];
  currentSlide: number;
  onSlideSelect: (index: number) => void;
  onClose: () => void;
}

const SlidesSidebar: React.FC<SlidesSidebarProps> = ({
  open, slides, currentSlide, onSlideSelect, onClose
}) => {
  return (
    <>
      {/* Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity z-40",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-xl",
        "border-r border-white/20 shadow-2xl transition-transform z-50",
        "flex flex-col",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
          <h2 className="text-lg font-semibold text-gray-900">Slides</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100/50 rounded-lg transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Slides List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {slides.map((slide, index) => (
            <SlideMenuItem
              key={slide.id}
              slide={slide}
              index={index}
              isActive={index === currentSlide}
              onClick={() => {
                onSlideSelect(index);
                onClose();
              }}
            />
          ))}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200/50">
          <div className="text-sm text-gray-500 text-center">
            {slides.length} slides total
          </div>
        </div>
      </div>
    </>
  )
}
```

#### Componente: SlideMenuItem
```tsx
interface SlideMenuItemProps {
  slide: Slide;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const SlideMenuItem: React.FC<SlideMenuItemProps> = ({
  slide, index, isActive, onClick
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full p-3 rounded-lg text-left transition-all duration-200",
        "flex items-start gap-3 group",
        isActive 
          ? "bg-prisma-red/10 border border-prisma-red/20 shadow-sm" 
          : "hover:bg-gray-100/50 border border-transparent"
      )}
    >
      {/* Slide Number */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
        isActive 
          ? "bg-prisma-red text-white" 
          : "bg-gray-200 text-gray-600 group-hover:bg-gray-300"
      )}>
        {index + 1}
      </div>
      
      {/* Slide Content */}
      <div className="flex-1 min-w-0">
        <div className={cn(
          "font-medium text-sm truncate",
          isActive ? "text-prisma-red" : "text-gray-900"
        )}>
          {slide.title || `Slide ${index + 1}`}
        </div>
        
        <div className="flex items-center gap-2 mt-1">
          <span className={cn(
            "text-xs px-2 py-0.5 rounded-full",
            slide.type === 'title' && "bg-blue-100 text-blue-700",
            slide.type === 'content' && "bg-green-100 text-green-700",
            slide.type === 'image' && "bg-purple-100 text-purple-700",
            slide.type === 'video' && "bg-orange-100 text-orange-700"
          )}>
            {slide.type}
          </span>
          
          {slide.duration && (
            <span className="text-xs text-gray-500">
              {slide.duration}s
            </span>
          )}
        </div>
      </div>
      
      {/* Active Indicator */}
      {isActive && (
        <div className="flex-shrink-0">
          <div className="w-2 h-2 bg-prisma-red rounded-full" />
        </div>
      )}
    </button>
  )
}
```

### Backoffice - Administración

#### Estructura de Componentes
```
src/components/ui/backoffice/
├── DashboardLayout.tsx         # Layout principal con sidebar
├── PresentationCard.tsx        # Tarjeta de presentación
├── DataTable.tsx              # Tabla de datos con filtros
├── StatsCard.tsx              # Tarjetas de estadísticas
├── ActionButton.tsx           # Botones de acción
├── Modal.tsx                  # Modales reutilizables
└── forms/
    ├── PresentationForm.tsx    # Formulario de presentación
    ├── UserForm.tsx           # Formulario de usuario
    └── SettingsForm.tsx       # Formulario de configuración
```

---

## 🎨 Sistema de Iconos

### Decisión: Heroicons + Lucide React

#### ¿Por qué NO SF Symbols?
- **Restricción de Licencia**: Solo permitido para apps nativas de Apple
- **Prohibido para Web**: Explícitamente prohibido en sitios web
- **Riesgo Legal**: Apple es muy protectora de su propiedad intelectual

#### Heroicons (Principal)
```bash
npm install @heroicons/react
```

```tsx
import { 
  HomeIcon,           // 🏠 Home
  ChevronLeftIcon,    // ◀️ Previous
  ChevronRightIcon,   // ▶️ Next
  PlayIcon,           // ▶️ Present
  StopIcon,           // ⏹️ Stop
  ChatBubbleLeftIcon, // 💬 Chat
  HandRaisedIcon,     // ✋ Raise Hand
  MicrophoneIcon,     // 🎤 Listening
  Bars3Icon,          // ☰ Menu
  XMarkIcon           // ✕ Close
} from '@heroicons/react/24/outline'
```

#### Lucide React (Secundario)
```tsx
import { 
  Volume2,    // 🔊 Audio
  Settings,   // ⚙️ Settings
  Users,      // 👥 Users
  BarChart3   // 📊 Analytics
} from 'lucide-react'
```

### Implementación con Liquid Glass
```tsx
const LiquidIcon: React.FC<IconProps> = ({ Icon, variant = 'default', ...props }) => (
  <div className={cn(
    "liquid-glass-icon transition-all duration-200",
    "hover:scale-110 hover:drop-shadow-lg",
    variant === 'primary' && "text-prisma-red",
    variant === 'secondary' && "text-gray-600"
  )}>
    <Icon {...props} className="w-5 h-5" />
  </div>
)
```

---

## 🌊 Efectos Liquid Glass

### CSS Custom Properties
```css
:root {
  /* Liquid Glass Variables - Optimizado para Fondo Blanco */
  --liquid-opacity: 0.95;
  --liquid-blur: 20px;
  --liquid-tint: rgba(255, 255, 255, 0.9);
  --liquid-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  --liquid-border: rgba(0, 0, 0, 0.08);
  
  /* Adaptive Variables */
  --content-brightness: 1;
  --motion-preference: 1;
  --shadow-intensity: 0.12;
}

/* Liquid Glass Base - Fondo Blanco */
.liquid-glass {
  background: rgba(255, 255, 255, var(--liquid-opacity));
  backdrop-filter: blur(var(--liquid-blur));
  -webkit-backdrop-filter: blur(var(--liquid-blur));
  border: 1px solid var(--liquid-border);
  box-shadow: var(--liquid-shadow);
}

/* Variantes para diferentes elementos */
.liquid-glass-card {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.liquid-glass-pill {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

/* Responsive Adaptations */
@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-preference: 0;
  }
}

@media (prefers-contrast: high) {
  :root {
    --liquid-opacity: 0.95;
    --shadow-intensity: 0.2;
  }
}
```

### Implementación con Tailwind
```tsx
// Usando utilidades de Tailwind para efectos base
<div className="bg-white/90 backdrop-blur-xl rounded-full
                shadow-2xl shadow-black/10 border border-white/30
                transition-all duration-300 ease-out
                hover:bg-white/95 hover:shadow-3xl
                data-[hidden=true]:opacity-0 
                data-[hidden=true]:translate-y-4">
```

---

## 🔧 Hooks Personalizados

### useAutoHide
```tsx
interface UseAutoHideOptions {
  delay?: number;
  enableOnMobile?: boolean;
}

const useAutoHide = (options: UseAutoHideOptions = {}) => {
  const { delay = 6000, enableOnMobile = false } = options;
  const [isVisible, setIsVisible] = useState(true);
  const lastActivity = useRef(Date.now());
  
  useEffect(() => {
    // Solo en desktop por defecto
    if (!enableOnMobile && window.innerWidth <= 768) return;
    
    const handleActivity = () => {
      lastActivity.current = Date.now();
      setIsVisible(true);
    };
    
    const checkInactivity = setInterval(() => {
      const inactive = Date.now() - lastActivity.current > delay;
      if (inactive) setIsVisible(false);
    }, 1000);
    
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keydown', handleActivity);
    document.addEventListener('click', handleActivity);
    
    return () => {
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keydown', handleActivity);
      document.removeEventListener('click', handleActivity);
      clearInterval(checkInactivity);
    };
  }, [delay, enableOnMobile]);
  
  return isVisible;
};
```

### useToolbarState
```tsx
interface ToolbarState {
  mode: 'manual' | 'narrated';
  isPresenting: boolean;
  handState: 'normal' | 'raised' | 'listening';
  currentSlide: number;
  totalSlides: number;
  menuOpen: boolean;
}

const useToolbarState = (initialSlide = 0, totalSlides = 0) => {
  const [state, setState] = useState<ToolbarState>({
    mode: 'manual',
    isPresenting: false,
    handState: 'normal',
    currentSlide: initialSlide,
    totalSlides,
    menuOpen: false
  });
  
  const togglePresentation = useCallback(() => {
    setState(prev => ({
      ...prev,
      isPresenting: !prev.isPresenting,
      mode: !prev.isPresenting ? 'narrated' : 'manual'
    }));
  }, []);
  
  const toggleHand = useCallback(() => {
    setState(prev => ({
      ...prev,
      handState: prev.handState === 'normal' ? 'raised' : 'normal'
    }));
  }, []);
  
  const toggleMenu = useCallback(() => {
    setState(prev => ({
      ...prev,
      menuOpen: !prev.menuOpen
    }));
  }, []);
  
  const closeMenu = useCallback(() => {
    setState(prev => ({
      ...prev,
      menuOpen: false
    }));
  }, []);
  
  const navigateToSlide = useCallback((slideIndex: number) => {
    setState(prev => ({
      ...prev,
      currentSlide: Math.max(0, Math.min(slideIndex, prev.totalSlides - 1)),
      menuOpen: false // Cerrar menú al navegar
    }));
  }, []);
  
  return {
    state,
    actions: {
      togglePresentation,
      toggleHand,
      toggleMenu,
      closeMenu,
      navigateToSlide,
      nextSlide: () => navigateToSlide(state.currentSlide + 1),
      prevSlide: () => navigateToSlide(state.currentSlide - 1),
      goHome: () => navigateToSlide(0)
    }
  };
};
```

### useLiquidGlass
```tsx
const useLiquidGlass = () => {
  const [brightness, setBrightness] = useState(1);
  const [motionPreference, setMotionPreference] = useState(1);
  
  useEffect(() => {
    // Detectar preferencias del usuario
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
    
    const updatePreferences = () => {
      setMotionPreference(prefersReducedMotion.matches ? 0 : 1);
      // Actualizar variables CSS
      document.documentElement.style.setProperty(
        '--motion-preference', 
        prefersReducedMotion.matches ? '0' : '1'
      );
    };
    
    updatePreferences();
    prefersReducedMotion.addEventListener('change', updatePreferences);
    prefersHighContrast.addEventListener('change', updatePreferences);
    
    return () => {
      prefersReducedMotion.removeEventListener('change', updatePreferences);
      prefersHighContrast.removeEventListener('change', updatePreferences);
    };
  }, []);
  
  const updateContentBrightness = useCallback((element: HTMLElement) => {
    // Analizar brillo del contenido subyacente
    const computedStyle = getComputedStyle(element);
    const bgColor = computedStyle.backgroundColor;
    // Lógica para calcular brillo...
    setBrightness(calculatedBrightness);
    
    document.documentElement.style.setProperty(
      '--content-brightness', 
      calculatedBrightness.toString()
    );
  }, []);
  
  return {
    brightness,
    motionPreference,
    updateContentBrightness
  };
};
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
.toolbar {
  /* Mobile: Bottom fixed, full width */
  @apply fixed bottom-0 left-0 right-0 p-4;
}

@media (min-width: 768px) {
  .toolbar {
    /* Tablet: Centered bottom */
    @apply bottom-6 left-1/2 right-auto transform -translate-x-1/2 rounded-full;
  }
}

@media (min-width: 1024px) {
  .toolbar {
    /* Desktop: Auto-hide enabled */
    transition: opacity 0.3s ease, transform 0.3s ease;
  }
  
  .toolbar--hidden {
    @apply opacity-0 translate-y-4 pointer-events-none;
  }
}
```

### Adaptaciones Móviles
```tsx
const PresentationToolbar: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isVisible = useAutoHide({ 
    delay: 6000, 
    enableOnMobile: false // Auto-hide deshabilitado en móvil
  });
  
  return (
    <div className={cn(
      "fixed flex items-center gap-3 p-3",
      isMobile 
        ? "bottom-0 left-0 right-0 bg-white border-t" 
        : "bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-xl rounded-full shadow-lg"
    )}>
      {/* Contenido adaptativo */}
    </div>
  );
};
```

---

## 🎨 Tema Visual y Colores

### Tema Principal: Fondo Blanco
- **Fondo de presentación**: Blanco (`#FFFFFF`)
- **Sin modo oscuro**: Diseño único optimizado para claridad
- **Contraste alto**: Texto oscuro sobre fondo claro
- **Liquid Glass**: Transparencias sobre fondo blanco

### Colores Prisma (Definidos en Tailwind)
```typescript
// tailwind.config.ts
colors: {
  prisma: {
    red: "#DC2626",
    "red-hover": "#B91C1C", 
    "red-light": "#FEE2E2",
    "red-dark": "#991B1B",
  },
  neutral: {
    50: "#FAFAFA",
    100: "#F5F5F5", 
    200: "#E5E5E5",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
  }
}
```

### Aplicación en Componentes
```tsx
// Fondo de presentación
<div className="bg-white min-h-screen">

// Botón primario
<button className="bg-prisma-red hover:bg-prisma-red-hover text-white">

// Botón secundario  
<button className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700">

// Estados de iconos
<Icon className={cn(
  "w-5 h-5 transition-colors",
  isActive ? "text-prisma-red" : "text-neutral-600"
)} />

// Liquid Glass sobre fondo blanco
<div className="bg-white/90 backdrop-blur-xl border border-gray-200/50">
```

---

## ✨ Animaciones y Transiciones

### Principios de Movimiento
- **Duración**: 200-300ms para micro-interacciones
- **Easing**: `ease-out` para entradas, `ease-in` para salidas
- **Respeto a preferencias**: `prefers-reduced-motion`

### Implementación
```css
/* Transiciones base */
.interactive-element {
  transition: all 0.2s ease-out;
}

.interactive-element:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Respeto a preferencias de accesibilidad */
@media (prefers-reduced-motion: reduce) {
  .interactive-element {
    transition: none;
  }
  
  .interactive-element:hover {
    transform: none;
  }
}
```

---

## 🔮 Roadmap de Mejoras

### Fase 1: Implementación Base
- [x] Análisis de v4 completado
- [x] Investigación Liquid Glass completada
- [x] Decisión de iconos tomada
- [x] Especificación de menú lateral tipo iOS
- [x] Distribución final de footer unificado
- [x] Tema blanco sin modo oscuro definido
- [ ] PresentationFooter con layout estable
- [ ] SlidesSidebar con Liquid Glass
- [ ] Sistema auto-hide
- [ ] Mutación de modos sin movimiento de botones

### Fase 2: Efectos Premium
- [ ] Implementación Liquid Glass completa
- [ ] Adaptabilidad contextual
- [ ] Respuesta a preferencias de accesibilidad
- [ ] Optimización de performance

### Fase 3: Backoffice UI
- [ ] Sistema de componentes para admin
- [ ] Dashboard con Liquid Glass sutil
- [ ] Formularios premium
- [ ] Tablas de datos avanzadas

### Fase 4: Refinamiento
- [ ] Testing de accesibilidad
- [ ] Optimización móvil
- [ ] Micro-animaciones pulidas
- [ ] Documentación de componentes

---

## 📚 Referencias

- [Apple Liquid Glass Research](https://medium.com/@LizLeCompte/liquid-glass-apples-new-design-language-and-what-it-signals-for-ux-ui-in-2025-7307109943b7)
- [Heroicons Documentation](https://heroicons.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React 19 Features](https://react.dev/blog/2024/04/25/react-19)
- [Web Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

*Documento actualizado: 2025-01-07*
