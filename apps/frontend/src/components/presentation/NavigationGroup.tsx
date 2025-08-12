'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ToolbarButton } from './ToolbarButton';
import { cn } from '@/lib/utils';

interface NavigationGroupProps {
  currentSlide: number;
  totalSlides: number;
  mode: 'manual' | 'narrated';
  onPrevSlide: () => void;
  onNextSlide: () => void;
  className?: string;
}

export const NavigationGroup: React.FC<NavigationGroupProps> = ({
  currentSlide,
  totalSlides,
  mode,
  onPrevSlide,
  onNextSlide,
  className
}) => {
  const isDisabled = mode === 'narrated';
  const canGoPrev = currentSlide > 0;
  const canGoNext = currentSlide < totalSlides - 1;

  return (
    <div className={cn('flex items-center gap-1 px-2 min-w-[120px]', className)}>
      <ToolbarButton 
        icon={ChevronLeft}
        onClick={onPrevSlide}
        disabled={isDisabled || !canGoPrev}
        className={cn(
          'transition-opacity duration-200',
          isDisabled ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
        )}
        title="Slide anterior (←)"
      />
      
      <span className="px-2 text-sm font-medium min-w-[40px] text-center text-neutral-700">
        {currentSlide + 1}/{totalSlides}
      </span>
      
      <ToolbarButton 
        icon={ChevronRight}
        onClick={onNextSlide}
        disabled={isDisabled || !canGoNext}
        className={cn(
          'transition-opacity duration-200',
          isDisabled ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
        )}
        title="Slide siguiente (→)"
      />
    </div>
  );
};
