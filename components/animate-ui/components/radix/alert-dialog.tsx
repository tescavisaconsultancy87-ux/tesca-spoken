'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface AlertDialogContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AlertDialogContext = React.createContext<AlertDialogContextProps | undefined>(undefined);

export const AlertDialog = ({ children, open: controlledOpen, onOpenChange }: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;
  
  const setOpen = React.useCallback((val: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(val);
    }
    onOpenChange?.(val);
  }, [isControlled, onOpenChange]);

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
};

export const AlertDialogTrigger = ({ children, asChild }: { children: React.ReactElement; asChild?: boolean }) => {
  const context = React.useContext(AlertDialogContext);
  if (!context) throw new Error('AlertDialogTrigger must be used inside AlertDialog');

  const child = children as React.ReactElement<{ onClick?: (e: React.MouseEvent) => void }>;

  return React.cloneElement(child, {
    onClick: (e: React.MouseEvent) => {
      child.props.onClick?.(e);
      context.setOpen(true);
    }
  });
};

export interface AlertDialogContentProps {
  children: React.ReactNode;
  from?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  className?: string;
}

export const AlertDialogContent = ({ children, from = 'center', className = '' }: AlertDialogContentProps) => {
  const context = React.useContext(AlertDialogContext);
  if (!context) throw new Error('AlertDialogContent must be used inside AlertDialog');

  const getInitialPosition = () => {
    switch (from) {
      case 'top': return { y: '-100vh', x: 0, scale: 1, opacity: 0 };
      case 'bottom': return { y: '100vh', x: 0, scale: 1, opacity: 0 };
      case 'left': return { x: '-100vw', y: 0, scale: 1, opacity: 0 };
      case 'right': return { x: '100vw', y: 0, scale: 1, opacity: 0 };
      case 'center':
      default: return { scale: 0.95, opacity: 0, x: 0, y: 0 };
    }
  };

  const getExitPosition = () => {
    switch (from) {
      case 'top': return { y: '-100vh', opacity: 0 };
      case 'bottom': return { y: '100vh', opacity: 0 };
      case 'left': return { x: '-100vw', opacity: 0 };
      case 'right': return { x: '100vw', opacity: 0 };
      case 'center':
      default: return { scale: 0.95, opacity: 0 };
    }
  };

  return (
    <AnimatePresence>
      {context.open && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => context.setOpen(false)}
          className="fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px] flex items-center justify-center p-4"
        />
      )}
      {context.open && (
        <motion.div key="modal-container" className="fixed inset-0 z-[51] flex items-center justify-center p-4 pointer-events-none">
          <motion.div
            key="modal-popup"
            initial={getInitialPosition()}
            animate={{ 
              x: 0, 
              y: 0, 
              scale: 1, 
              opacity: 1 
            }}
            exit={getExitPosition()}
            transition={{
              type: 'spring',
              damping: 24,
              stiffness: 220,
            }}
            className={`pointer-events-auto w-full max-w-[380px] rounded-[24px] bg-white/90 backdrop-blur-[16px] border border-white/60 p-6 shadow-soft-xl ${className}`}
            style={{
              boxShadow: '0 20px 50px rgba(6, 119, 121, 0.12), 0 0 0 1px rgba(6, 119, 121, 0.05)'
            }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const AlertDialogHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col text-center sm:text-left gap-1.5 ${className}`}>{children}</div>
);

export const AlertDialogTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`font-heading text-base font-bold text-ink tracking-tight ${className}`}>{children}</h3>
);

export const AlertDialogDescription = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-sm text-ink-muted leading-relaxed font-body ${className}`}>{children}</p>
);

export const AlertDialogFooter = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`flex flex-col sm:flex-row sm:justify-end gap-2.5 mt-6 ${className}`}>{children}</div>
);

export const AlertDialogCancel = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const context = React.useContext(AlertDialogContext);
  if (!context) throw new Error('AlertDialogCancel must be used inside AlertDialog');

  return (
    <button
      onClick={() => context.setOpen(false)}
      className={`btn-secondary py-2 px-5 text-xs font-semibold uppercase tracking-wider rounded-xl hover:scale-[1.02] active:scale-100 transition-all ${className}`}
    >
      {children}
    </button>
  );
};

export const AlertDialogAction = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const context = React.useContext(AlertDialogContext);
  if (!context) throw new Error('AlertDialogAction must be used inside AlertDialog');

  return (
    <button
      onClick={() => context.setOpen(false)}
      className={`btn-warm py-2 px-5 text-xs font-semibold uppercase tracking-wider rounded-xl hover:scale-[1.02] active:scale-100 transition-all ${className}`}
    >
      {children}
    </button>
  );
};
