'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { LiquidGlass } from '../ui/LiquidGlass';
import { ToolbarButton } from './ToolbarButton';
import { cn } from '@/lib/utils';

interface Slide {
  id: string;
  type: string;
  title: string;
  content?: any;
  subtitle?: string;
}

interface SlidesSidebarProps {
  open: boolean;
  slides: Slide[];
  currentSlide: number;
  onSlideSelect: (index: number) => void;
  onClose: () => void;
}

const getSlideTypeBadge = (type: string) => {
  const badges = {
    title: { label: 'Título', className: 'bg-blue-100 text-blue-700' },
    content: { label: 'Contenido', className: 'bg-green-100 text-green-700' },
    image: { label: 'Imagen', className: 'bg-purple-100 text-purple-700' },
    video: { label: 'Video', className: 'bg-orange-100 text-orange-700' },
    default: { label: 'Slide', className: 'bg-gray-100 text-gray-700' }
  };
  
  return badges[type as keyof typeof badges] || badges.default;
};

export const SlidesSidebar: React.FC<SlidesSidebarProps> = ({
  open,
  slides,
  currentSlide,
  onSlideSelect,
  onClose
}) => {
  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Prevenir scroll del body cuando está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const handleSlideClick = (index: number) => {
    onSlideSelect(index);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={cn(
        'relative w-80 h-full transform transition-transform duration-300 ease-out',
        'animate-in slide-in-from-left'
      )}>
        <LiquidGlass className="h-full bg-white/95 backdrop-blur-xl border-r border-black/10 shadow-2xl rounded-none flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-black/5">
            <h3 className="text-lg font-semibold text-neutral-800">Slides</h3>
            <ToolbarButton 
              icon={X}
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700"
              title="Cerrar menú (Esc)"
            />
          </div>
          
          {/* Slides List */}
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              {slides.map((slide, index) => {
                const isActive = index === currentSlide;
                const badge = getSlideTypeBadge(slide.type);
                
                return (
                  <button
                    key={slide.id}
                    onClick={() => handleSlideClick(index)}
                    className={cn(
                      'w-full p-3 rounded-lg text-left transition-all duration-200',
                      'hover:bg-neutral-100',
                      isActive 
                        ? 'bg-prisma-red-light border border-prisma-red text-prisma-red' 
                        : 'bg-transparent border border-transparent text-neutral-700'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {/* Slide Number */}
                      <div className={cn(
                        'flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium',
                        isActive 
                          ? 'bg-prisma-red text-white' 
                          : 'bg-neutral-200 text-neutral-600'
                      )}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {/* Title */}
                        <div className="font-medium text-sm truncate mb-1">
                          {slide.title}
                        </div>
                        
                        {/* Type Badge */}
                        <span className={cn(
                          'inline-block px-2 py-1 rounded-md text-xs font-medium',
                          badge.className
                        )}>
                          {badge.label}
                        </span>
                        
                        {/* Active Indicator */}
                        {isActive && (
                          <div className="flex items-center gap-1 mt-2">
                            <div className="w-2 h-2 bg-prisma-red rounded-full"></div>
                            <span className="text-xs text-prisma-red font-medium">Actual</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-black/5">
            <div className="text-sm text-neutral-500 text-center">
              {slides.length} slides en total
            </div>
          </div>
        </LiquidGlass>
      </div>
    </div>
  );
};
