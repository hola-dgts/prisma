'use client';

import { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'active';
  size?: 'sm' | 'md' | 'lg';
}

export const ToolbarButton = forwardRef<HTMLButtonElement, ToolbarButtonProps>(
  ({ className, icon: Icon, variant = 'default', size = 'md', disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-prisma-red';
    
    const variants = {
      default: 'text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100',
      primary: 'text-white bg-prisma-red hover:bg-prisma-red-hover',
      active: 'text-prisma-red bg-prisma-red-light hover:bg-prisma-red-light/80'
    };

    const sizes = {
      sm: 'h-8 w-8 text-sm',
      md: 'h-10 w-10',
      lg: 'h-12 w-12 text-lg'
    };

    const disabledClasses = disabled 
      ? 'opacity-30 cursor-not-allowed hover:bg-transparent hover:text-current' 
      : '';

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          disabledClasses,
          className
        )}
        {...props}
      >
        <Icon className="w-5 h-5" />
      </button>
    );
  }
);

ToolbarButton.displayName = 'ToolbarButton';
