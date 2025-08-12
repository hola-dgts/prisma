'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// Liquid Glass Base Component
interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'card' | 'pill' | 'button';
  children: React.ReactNode;
}

export const LiquidGlass = forwardRef<HTMLDivElement, LiquidGlassProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const baseClasses = 'backdrop-blur-xl border transition-all duration-200';
    
    const variants = {
      default: 'bg-white/95 border-black/8 shadow-lg',
      card: 'bg-white/92 border-black/6 shadow-md rounded-lg',
      pill: 'bg-white/95 border-black/8 shadow-xl rounded-full',
      button: 'bg-white/90 border-black/10 shadow-md rounded-lg hover:bg-white/95 hover:shadow-lg'
    };

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variants[variant], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

LiquidGlass.displayName = 'LiquidGlass';

// Specialized Components
export const LiquidGlassCard = forwardRef<HTMLDivElement, Omit<LiquidGlassProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <LiquidGlass ref={ref} variant="card" className={cn('p-4', className)} {...props} />
  )
);

LiquidGlassCard.displayName = 'LiquidGlassCard';

export const LiquidGlassPill = forwardRef<HTMLDivElement, Omit<LiquidGlassProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <LiquidGlass ref={ref} variant="pill" className={cn('px-4 py-2', className)} {...props} />
  )
);

LiquidGlassPill.displayName = 'LiquidGlassPill';

export const LiquidGlassButton = forwardRef<HTMLDivElement, Omit<LiquidGlassProps, 'variant'>>(
  ({ className, ...props }, ref) => (
    <LiquidGlass ref={ref} variant="button" className={cn('p-3', className)} {...props} />
  )
);

LiquidGlassButton.displayName = 'LiquidGlassButton';
