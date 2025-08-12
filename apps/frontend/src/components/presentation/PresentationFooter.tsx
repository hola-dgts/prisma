'use client';

import { useState } from 'react';
import { Home, Play, Square, Hand, Mic, Menu, MessageCircle } from 'lucide-react';
import { LiquidGlassCard, LiquidGlassPill, LiquidGlassButton } from '../ui/LiquidGlass';
import { ToolbarButton } from './ToolbarButton';
import { NavigationGroup } from './NavigationGroup';
import { SlidesSidebar } from './SlidesSidebar';
import { useResponsiveTitle } from '@/hooks/useResponsiveTitle';
import { useAutoHide } from '@/hooks/useAutoHide';
import { cn } from '@/lib/utils';

interface Slide {
  id: string;
  type: string;
  title: string;
  content?: any;
  subtitle?: string;
}

interface PresentationFooterProps {
  presentationTitle: string;
  slides: Slide[];
  currentSlide: number;
  totalSlides: number;
  mode: 'manual' | 'narrated';
  isPresenting: boolean;
  handState: 'normal' | 'raised' | 'listening';
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onGoHome: () => void;
  onTogglePresentation: () => void;
  onToggleHand: () => void;
  onSlideSelect: (index: number) => void;
  onToggleChat: () => void;
  onToggleMenu: () => void;
}

export const PresentationFooter: React.FC<PresentationFooterProps> = ({
  presentationTitle,
  slides,
  currentSlide,
  totalSlides,
  mode,
  isPresenting,
  handState,
  onPrevSlide,
  onNextSlide,
  onGoHome,
  onTogglePresentation,
  onToggleHand,
  onSlideSelect,
  onToggleChat,
  onToggleMenu
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { displayTitle } = useResponsiveTitle(presentationTitle);
  const { isVisible } = useAutoHide(6000);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  // Determinar icono de mano según estado
  const getHandIcon = () => {
    switch (handState) {
      case 'listening':
        return Mic;
      case 'raised':
      case 'normal':
      default:
        return Hand;
    }
  };

  // Determinar variant del botón de mano
  const getHandVariant = () => {
    return handState !== 'normal' ? 'active' : 'default';
  };

  return (
    <>
      <div 
        className={cn(
          'fixed bottom-0 left-0 right-0 p-6 pointer-events-none transition-all duration-300',
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        )}
      >
        <div className="flex items-end justify-between max-w-screen-xl mx-auto">
          
          {/* Menú + Título */}
          <LiquidGlassCard className="pointer-events-auto flex items-center gap-3 max-w-md">
            <ToolbarButton 
              icon={Menu} 
              onClick={onToggleMenu}
              className="flex-shrink-0"
              title="Menú de slides (M)"
            />
            <div className="min-w-0 flex-1 py-2 pr-3">
              <div 
                className="text-sm font-medium text-neutral-700 truncate"
                title={presentationTitle}
              >
                {displayTitle}
              </div>
            </div>
          </LiquidGlassCard>
          
          {/* Toolbar de Controles */}
          <LiquidGlassPill className="pointer-events-auto flex items-center gap-1">
            <ToolbarButton 
              icon={Home} 
              onClick={onGoHome}
              title="Ir al inicio (Home)"
            />
            
            <NavigationGroup
              currentSlide={currentSlide}
              totalSlides={totalSlides}
              mode={mode}
              onPrevSlide={onPrevSlide}
              onNextSlide={onNextSlide}
            />
            
            <ToolbarButton 
              icon={isPresenting ? Square : Play}
              onClick={onTogglePresentation}
              variant="primary"
              title={isPresenting ? 'Detener presentación' : 'Iniciar presentación'}
            />
            
            <ToolbarButton 
              icon={getHandIcon()}
              onClick={onToggleHand}
              disabled={mode === 'manual'}
              variant={getHandVariant()}
              className={cn(
                'transition-opacity duration-200',
                mode === 'manual' ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
              )}
              title={
                mode === 'manual' 
                  ? 'Solo disponible en modo narrado' 
                  : handState === 'listening' 
                    ? 'Escuchando pregunta...' 
                    : 'Levantar mano para preguntar'
              }
            />
          </LiquidGlassPill>
          
          {/* Chat */}
          <LiquidGlassButton 
            className="pointer-events-auto cursor-pointer"
            onClick={onToggleChat}
            title="Chat interactivo (C)"
          >
            <MessageCircle className="w-5 h-5 text-neutral-600" />
          </LiquidGlassButton>
        </div>
      </div>
      
      {/* Slides Sidebar */}
      <SlidesSidebar 
        open={menuOpen}
        slides={slides}
        currentSlide={currentSlide}
        onSlideSelect={onSlideSelect}
        onClose={closeMenu}
      />
    </>
  );
};
