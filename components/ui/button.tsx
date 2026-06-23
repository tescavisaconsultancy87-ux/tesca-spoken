import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'warm' | 'outline' | 'ghost';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', ...props }, ref) => {
    let baseStyle = 'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 focus:outline-none focus-visible:ring-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50 text-sm py-2.5 px-6 ';
    
    if (variant === 'primary') {
      baseStyle += 'bg-primary text-white hover:bg-primary-600 shadow-soft hover:shadow-soft-lg';
    } else if (variant === 'secondary') {
      baseStyle += 'border-2 border-primary text-primary hover:bg-primary hover:text-white';
    } else if (variant === 'warm') {
      baseStyle += 'bg-secondary text-white hover:bg-secondary-600 shadow-warm hover:scale-[1.03]';
    } else if (variant === 'outline') {
      baseStyle += 'border border-black/10 bg-transparent text-ink hover:bg-black/5';
    } else if (variant === 'ghost') {
      baseStyle += 'bg-transparent text-ink-soft hover:bg-black/5';
    }

    return (
      <button
        ref={ref}
        className={`${baseStyle} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
