import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'danger' | 'ghost';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const base = 'btn';
    const map: Record<Variant, string> = {
      primary: 'btn-primary',
      danger: 'btn-danger',
      ghost: 'btn-ghost',
    };
    const sizes: Record<NonNullable<Props['size']>, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-5 py-3 text-base',
    };
    return (
      <button ref={ref} className={cn(base, map[variant], sizes[size], className)} {...props} />
    );
  }
);
Button.displayName = 'Button';

