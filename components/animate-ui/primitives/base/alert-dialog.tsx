'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { createPortal } from 'react-dom';

export type AlertDialogFlipDirection = 'top' | 'bottom' | 'left' | 'right' | 'center';

interface AlertDialogContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const AlertDialogContext = React.createContext<AlertDialogContextProps | undefined>(undefined);

export const AlertDialog = ({
  children,
  open: controlledOpen,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = React.useCallback(
    (val: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(val);
      }
      onOpenChange?.(val);
    },
    [isControlled, onOpenChange]
  );

  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  );
};

export const AlertDialogTrigger = ({
  children,
  className = '',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const context = React.useContext(AlertDialogContext);
  if (!context) throw new Error('AlertDialogTrigger must be used inside AlertDialog');

  return (
    <button
      type="button"
      className={className}
      onClick={() => context.setOpen(true)}
      {...props}
    >
      {children}
    </button>
  );
};

export const AlertDialogPortal = ({ children }: { children: React.ReactNode }) => {
  const context = React.useContext(AlertDialogContext);
  if (!context) throw new Error('AlertDialogPortal must be used inside AlertDialog');

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {context.open && React.Children.map(children, (child, idx) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            key: child.key || `alert-child-${idx}`
          } as any);
        }
        return child;
      })}
    </AnimatePresence>,
    document.body
  );
};

export const AlertDialogBackdrop = ({
  className = '',
  onClick,
  ...props
}: {
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const context = React.useContext(AlertDialogContext);
  if (!context) throw new Error('AlertDialogBackdrop must be used inside AlertDialog');

  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e);
    // Standard alert dialogs usually don't close on click outside, but we allow backdrop click to trigger close.
    context.setOpen(false);
  };

  return (
    <motion.div
      key="backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={className}
      onClick={handleClick}
      {...props}
    />
  );
};

export const AlertDialogPopup = ({
  children,
  from = 'center',
  className = '',
  ...props
}: {
  children: React.ReactNode;
  from?: AlertDialogFlipDirection;
  className?: string;
}) => {
  const context = React.useContext(AlertDialogContext);
  if (!context) throw new Error('AlertDialogPopup must be used inside AlertDialog');

  const getInitialPosition = () => {
    switch (from) {
      case 'top':
        return { y: '-100vh', x: '-50%', scale: 0.95, opacity: 0 };
      case 'bottom':
        return { y: '100vh', x: '-50%', scale: 0.95, opacity: 0 };
      case 'left':
        return { x: '-100vw', y: '-50%', scale: 0.95, opacity: 0 };
      case 'right':
        return { x: '100vw', y: '-50%', scale: 0.95, opacity: 0 };
      case 'center':
      default:
        return { scale: 0.9, opacity: 0, x: '-50%', y: '-50%' };
    }
  };

  const getExitPosition = () => {
    switch (from) {
      case 'top':
        return { y: '-100vh', x: '-50%', opacity: 0 };
      case 'bottom':
        return { y: '100vh', x: '-50%', opacity: 0 };
      case 'left':
        return { x: '-100vw', y: '-50%', opacity: 0 };
      case 'right':
        return { x: '100vw', y: '-50%', opacity: 0 };
      case 'center':
      default:
        return { scale: 0.9, opacity: 0, x: '-50%', y: '-50%' };
    }
  };

  return (
    <motion.div
      key="popup"
      initial={getInitialPosition()}
      animate={{
        x: '-50%',
        y: '-50%',
        scale: 1,
        opacity: 1,
      }}
      exit={getExitPosition()}
      transition={{
        type: 'spring',
        damping: 26,
        stiffness: 240,
      }}
      className={`fixed left-1/2 top-1/2 z-50 ${className}`}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const AlertDialogHeader = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`flex flex-col gap-1.5 ${className}`}>{children}</div>;

export const AlertDialogTitle = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => <h3 className={`font-heading font-bold text-ink tracking-tight ${className}`}>{children}</h3>;

export const AlertDialogDescription = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => <p className={`text-sm text-ink-muted leading-relaxed font-body ${className}`}>{children}</p>;

export const AlertDialogFooter = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`flex items-center justify-end gap-2.5 mt-6 ${className}`}>{children}</div>;

export const AlertDialogClose = ({
  children,
  className = '',
  onClick,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const context = React.useContext(AlertDialogContext);
  if (!context) throw new Error('AlertDialogClose must be used inside AlertDialog');

  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e);
    context.setOpen(false);
  };

  return (
    <button
      type="button"
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
};
