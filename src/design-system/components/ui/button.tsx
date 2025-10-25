import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'rounded-xl px-4 py-2 font-medium bg-primary text-white hover:opacity-90 transition',
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
