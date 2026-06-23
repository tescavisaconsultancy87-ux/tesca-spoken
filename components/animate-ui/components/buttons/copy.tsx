'use client';

import * as React from 'react';
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  content: string;
  variant?: 'primary' | 'secondary' | 'warm' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  ({ className = '', variant = 'outline', size = 'sm', content, ...props }, ref) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    };

    let baseStyle = 'inline-flex items-center justify-center gap-1.5 rounded-xl font-bold transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50 cursor-pointer ';

    // Sizing
    if (size === 'sm') {
      baseStyle += 'px-3 py-1.5 text-[10px] ';
    } else if (size === 'md') {
      baseStyle += 'px-4 py-2.5 text-xs ';
    } else if (size === 'lg') {
      baseStyle += 'px-5 py-3 text-sm ';
    }

    // Variants
    if (variant === 'primary') {
      baseStyle += 'bg-primary text-white hover:bg-primary-600 shadow-soft';
    } else if (variant === 'secondary') {
      baseStyle += 'border-2 border-primary text-primary hover:bg-primary hover:text-white';
    } else if (variant === 'warm') {
      baseStyle += 'bg-secondary text-white hover:bg-secondary-600 shadow-warm';
    } else if (variant === 'outline') {
      baseStyle += 'border border-gray-150 bg-white text-gray-700 hover:bg-gray-50';
    } else if (variant === 'ghost') {
      baseStyle += 'bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-700';
    }

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleCopy}
        className={`${baseStyle} ${className}`}
        aria-label={copied ? 'Copied!' : 'Copy to clipboard'}
        {...props}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5 text-emerald-500 animate-scale-up" />
            <span className="text-emerald-600">Copied</span>
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" />
            <span>Copy</span>
          </>
        )}
      </button>
    );
  }
);

CopyButton.displayName = 'CopyButton';
