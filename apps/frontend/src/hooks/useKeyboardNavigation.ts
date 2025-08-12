'use client';

import { useEffect } from 'react';

interface UseKeyboardNavigationProps {
  onPrevSlide: () => void;
  onNextSlide: () => void;
  onToggleMenu?: () => void;
  onToggleChat?: () => void;
  onGoHome?: () => void;
  disabled?: boolean;
}

export const useKeyboardNavigation = ({
  onPrevSlide,
  onNextSlide,
  onToggleMenu,
  onToggleChat,
  onGoHome,
  disabled = false
}: UseKeyboardNavigationProps) => {
  useEffect(() => {
    if (disabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignorar si el usuario está escribiendo en un input
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          onPrevSlide();
          break;
          
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ': // Spacebar
          event.preventDefault();
          onNextSlide();
          break;
          
        case 'Home':
          if (onGoHome) {
            event.preventDefault();
            onGoHome();
          }
          break;
          
        case 'm':
        case 'M':
          if (onToggleMenu) {
            event.preventDefault();
            onToggleMenu();
          }
          break;
          
        case 'c':
        case 'C':
          if (onToggleChat) {
            event.preventDefault();
            onToggleChat();
          }
          break;
          
        case 'Escape':
          // Cerrar menús abiertos
          if (onToggleMenu) {
            event.preventDefault();
            onToggleMenu();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onPrevSlide, onNextSlide, onToggleMenu, onToggleChat, onGoHome, disabled]);
};
