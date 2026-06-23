'use client';

import React, { createContext, useContext, useState, useEffect, useRef, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
interface DropdownMenuProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DropdownMenuContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const DropdownMenuContext = createContext<DropdownMenuContextType | undefined>(undefined);

export function DropdownMenu({ children, open: controlledOpen, onOpenChange }: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const setIsOpen = (val: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(val);
    }
    onOpenChange?.(val);
  };

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen, triggerRef }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  );
}

export function DropdownMenuTrigger({ children }: { children: React.ReactNode }) {
  const context = useContext(DropdownMenuContext);
  if (!context) throw new Error('DropdownMenuTrigger must be used within a DropdownMenu');

  const { isOpen, setIsOpen, triggerRef } = context;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={handleClick}
      aria-expanded={isOpen}
      className="focus:outline-none"
    >
      {children}
    </button>
  );
}

interface DropdownMenuContentProps {
  children: React.ReactNode;
  className?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  sideOffset?: number;
  align?: 'start' | 'center' | 'end';
  alignOffset?: number;
}

export function DropdownMenuContent({
  children,
  className = '',
  side = 'bottom',
  sideOffset = 4,
  align = 'start',
}: DropdownMenuContentProps) {
  const context = useContext(DropdownMenuContext);
  if (!context) throw new Error('DropdownMenuContent must be used within a DropdownMenu');

  const { isOpen, setIsOpen, triggerRef } = context;
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        contentRef.current &&
        !contentRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen, setIsOpen, triggerRef]);

  // Set width custom property to match the trigger button width
  useEffect(() => {
    if (isOpen && triggerRef.current && contentRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      contentRef.current.style.setProperty('--radix-dropdown-menu-trigger-width', `${rect.width}px`);
    }
  }, [isOpen, triggerRef]);

  // Position class helpers
  const getPositionClasses = () => {
    let classes = 'absolute z-50 ';
    if (side === 'bottom') {
      classes += `top-full mt-[${sideOffset}px] `;
      if (align === 'start') classes += 'left-0 origin-top-left';
      else if (align === 'end') classes += 'right-0 origin-top-right';
      else classes += 'left-1/2 -translate-x-1/2 origin-top';
    } else if (side === 'top') {
      classes += `bottom-full mb-[${sideOffset}px] `;
      if (align === 'start') classes += 'left-0 origin-bottom-left';
      else if (align === 'end') classes += 'right-0 origin-bottom-right';
      else classes += 'left-1/2 -translate-x-1/2 origin-bottom';
    } else if (side === 'left') {
      classes += `right-full mr-[${sideOffset}px] top-0 origin-top-right`;
    } else if (side === 'right') {
      classes += `left-full ml-[${sideOffset}px] top-0 origin-top-left`;
    }
    return classes;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0, scale: 0.95, y: side === 'bottom' ? -4 : 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: side === 'bottom' ? -4 : 4 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className={`${getPositionClasses()} min-w-[8rem] overflow-hidden rounded-2xl border border-black/8 bg-white p-1.5 shadow-soft-xl ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Highlight hover tracking context
interface HighlightContextType {
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  layoutId: string;
}

const HighlightContext = createContext<HighlightContextType | undefined>(undefined);

export function DropdownMenuHighlight({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const layoutId = useId();

  return (
    <HighlightContext.Provider value={{ hoveredId, setHoveredId, layoutId }}>
      <div
        onMouseLeave={() => setHoveredId(null)}
        className="relative w-full z-10"
      >
        {children}
      </div>
    </HighlightContext.Provider>
  );
}

export function DropdownMenuHighlightItem({
  children,
  id,
}: {
  children: React.ReactNode;
  id?: string;
}) {
  const context = useContext(HighlightContext);
  if (!context) throw new Error('DropdownMenuHighlightItem must be used inside DropdownMenuHighlight');

  const { hoveredId, setHoveredId, layoutId } = context;
  const itemId = id || useId();

  return (
    <div
      onMouseEnter={() => setHoveredId(itemId)}
      className="relative z-10 w-full"
    >
      <AnimatePresence>
        {hoveredId === itemId && (
          <motion.div
            layoutId={layoutId}
            className="absolute inset-0 -z-10 rounded-xl bg-primary-50"
            transition={{
              type: 'spring',
              stiffness: 350,
              damping: 28,
            }}
          />
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  children,
  className = '',
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const context = useContext(DropdownMenuContext);

  const handleClick = (e: React.MouseEvent) => {
    onClick?.();
    context?.setIsOpen(false);
  };

  return (
    <div
      onClick={handleClick}
      className={`flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-ink-soft cursor-pointer hover:text-primary transition-colors ${className}`}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`px-3 py-2 text-xs font-bold text-ink-muted/60 uppercase tracking-wider ${className}`}>
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({ className = '' }: { className?: string }) {
  return <div className={`my-1 h-px bg-black/5 ${className}`} />;
}

export function DropdownMenuShortcut({
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className="ml-auto text-[10px] tracking-widest text-ink-muted/50"
      {...props}
    >
      {children}
    </span>
  );
}

export function DropdownMenuGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-0.5">{children}</div>;
}

// Submenu context
interface DropdownMenuSubContextType {
  isSubOpen: boolean;
  setIsSubOpen: (open: boolean) => void;
}

const DropdownMenuSubContext = createContext<DropdownMenuSubContextType | undefined>(undefined);

export function DropdownMenuSub({ children }: { children: React.ReactNode }) {
  const [isSubOpen, setIsSubOpen] = useState(false);

  return (
    <DropdownMenuSubContext.Provider value={{ isSubOpen, setIsSubOpen }}>
      <div
        onMouseEnter={() => setIsSubOpen(true)}
        onMouseLeave={() => setIsSubOpen(false)}
        className="relative w-full"
      >
        {children}
      </div>
    </DropdownMenuSubContext.Provider>
  );
}

export function DropdownMenuSubTrigger({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex w-full items-center gap-2 px-3 py-2 text-xs font-semibold text-ink-soft cursor-default transition-colors ${className}`}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSubContent({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const context = useContext(DropdownMenuSubContext);
  if (!context) throw new Error('DropdownMenuSubContent must be used within DropdownMenuSub');

  const { isSubOpen } = context;

  return (
    <AnimatePresence>
      {isSubOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: 4 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.95, x: 4 }}
          transition={{ duration: 0.12 }}
          className={`absolute left-full top-0 ml-1 min-w-[8rem] overflow-hidden rounded-xl border border-black/8 bg-white p-1 shadow-soft-xl z-50 ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
