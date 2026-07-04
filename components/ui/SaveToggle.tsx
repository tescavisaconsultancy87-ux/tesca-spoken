import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
const cn = (...classes: (string | undefined | null | boolean)[]) => classes.filter(Boolean).join(' ');

export type ButtonStatus = 'idle' | 'loading' | 'success' | 'saved';
export type Size = 'sm' | 'md' | 'lg';

const SIZE_CONFIG = {
  sm: {
    height: 40, // Adjust height slightly to fit common form styles better
    circleWidth: 40,
    idleWidth: 108,
    savedWidth: 128,
    text: 'text-[14px]',
    icon: 'text-lg',
    spinner: 'w-5 h-5',
    gap: 'gap-1.5',
    padding: 'px-3',
  },
  md: {
    height: 48,
    circleWidth: 48,
    idleWidth: 130,
    savedWidth: 148,
    text: 'text-[16px]',
    icon: 'text-xl',
    spinner: 'w-6 h-6',
    gap: 'gap-2',
    padding: 'px-4',
  },
  lg: {
    height: 56,
    circleWidth: 56,
    idleWidth: 160,
    savedWidth: 180,
    text: 'text-[18px]',
    icon: 'text-2xl',
    spinner: 'w-7 h-7',
    gap: 'gap-3',
    padding: 'px-5',
  },
};

const BsCheckCircleFill = ({ className }: { className?: string }) => (
  <svg
    stroke="currentColor"
    fill="currentColor"
    strokeWidth="0"
    viewBox="0 0 16 16"
    className={className}
    height="1em"
    width="1em"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
  </svg>
);

export interface SaveToggleProps {
  size?: Size;
  idleText?: string;
  savedText?: string;
  loadingDuration?: number;
  successDuration?: number;
  onStatusChange?: (status: ButtonStatus) => void;
  status?: ButtonStatus;
  setStatus?: (status: ButtonStatus) => void;
  type?: 'submit' | 'button' | 'reset';
  className?: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const SaveToggle: React.FC<SaveToggleProps> = ({
  size = 'md',
  idleText = 'Save',
  savedText = 'Saved',
  loadingDuration = 1000,
  successDuration = 800,
  onStatusChange,
  status: propStatus,
  setStatus: propSetStatus,
  type = 'button',
  className,
  disabled,
  onClick,
}) => {
  const [internalStatus, setInternalStatus] = useState<ButtonStatus>('idle');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const status = propStatus !== undefined ? propStatus : internalStatus;
  const setStatus = propSetStatus !== undefined ? propSetStatus : setInternalStatus;

  const cfg = SIZE_CONFIG[size];
  const stableWidth = Math.max(cfg.idleWidth, cfg.savedWidth);

  useEffect(() => {
    onStatusChange?.(status);
  }, [status, onStatusChange]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
      
      const observer = new MutationObserver(() => {
        const darkActive = document.documentElement.classList.contains('dark');
        setTheme(darkActive ? 'dark' : 'light');
      });
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
      return () => observer.disconnect();
    }
  }, []);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || status === 'loading') return;
    
    if (onClick) {
      const result = onClick(e) as any;
      if (result && typeof result.then === 'function') {
        if (propStatus === undefined) {
          if (status === 'idle') {
            setStatus('loading');
            try {
              await result;
              setStatus('success');
              setTimeout(() => {
                setStatus('saved');
              }, successDuration);
            } catch (err) {
              setStatus('idle');
            }
          } else if (status === 'saved') {
            setStatus('idle');
          }
        }
      } else {
        if (propStatus === undefined) {
          if (status === 'idle') {
            setStatus('loading');
            setTimeout(() => {
              setStatus('success');
              setTimeout(() => {
                setStatus('saved');
              }, successDuration);
            }, loadingDuration);
          } else if (status === 'saved') {
            setStatus('idle');
          }
        }
      }
    } else {
      if (propStatus === undefined) {
        if (status === 'idle') {
          setStatus('loading');
          setTimeout(() => {
            setStatus('success');
            setTimeout(() => {
              setStatus('saved');
            }, successDuration);
          }, loadingDuration);
        } else if (status === 'saved') {
          setStatus('idle');
        }
      }
    }
  };

  const isCircle = status === 'loading' || status === 'success';

  const getBackgroundColor = () => {
    if (disabled) {
      return theme === 'dark' ? '#1f1f23' : '#e4e4e7';
    }
    if (status === 'loading' || status === 'success') {
      return theme === 'dark' ? '#ffffff' : '#18181b';
    }
    if (status === 'saved') {
      return theme === 'dark' ? '#27272a' : '#ffffff';
    }
    return theme === 'dark' ? '#27272a' : '#E8E7E0';
  };

  const getBorderColor = () => {
    if (status === 'saved') {
      return theme === 'dark' ? '#ffffff10' : '#00000030';
    }
    return 'transparent';
  };

  const getCheckColor = () => {
    if (status === 'success') {
      return theme === 'dark' ? '#27272a' : '#ffffff';
    }
    return theme === 'dark' ? '#a1a1aa' : '#27272a';
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <MotionConfig
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
          mass: 1,
        }}
      >
        <motion.button
          type={type}
          onClick={handleClick}
          disabled={disabled || status === 'loading'}
          initial={false}
          animate={{
            width: isCircle ? cfg.circleWidth : stableWidth,
            height: cfg.height,
            backgroundColor: getBackgroundColor(),
          }}
          style={{
            borderWidth: status === 'saved' ? '2px' : '0',
            borderColor: getBorderColor(),
          }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            mass: 1.2,
            backgroundColor: {
              duration: 0.2,
            },
          }}
          className={cn(
            'relative z-0 flex cursor-pointer items-center justify-center overflow-hidden rounded-full select-none focus:outline-none active:scale-[0.97] disabled:cursor-not-allowed',
          )}
        >
          <AnimatePresence mode="popLayout">
            {status === 'idle' && (
              <motion.span
                key="idle"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15, x: -20 }}
                className={cn(
                  "absolute inset-0 flex items-center justify-center font-bold tracking-tight",
                  disabled
                    ? "text-zinc-400 dark:text-zinc-500"
                    : "text-[#2C2A26] dark:text-zinc-200",
                  cfg.text
                )}
              >
                {idleText}
              </motion.span>
            )}

            {status === 'loading' && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(4px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 0.8, filter: 'blur(4px)' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.svg
                  viewBox="0 0 26 26"
                  className={cfg.spinner}
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.7,
                    ease: 'linear',
                  }}
                >
                  <circle
                    cx="13"
                    cy="13"
                    r="10"
                    stroke={theme === 'dark' ? '#52525b' : '#D0CCC6'}
                    strokeWidth="3"
                    fill="none"
                  />
                  <path
                    d="M13 3 A10 10 0 0 1 23 13"
                    stroke={theme === 'dark' ? '#a1a1aa' : 'white'}
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                  />
                </motion.svg>
              </motion.div>
            )}

            {(status === 'success' || status === 'saved') && (
              <motion.div
                key="check-state"
                layout
                initial={
                  status === 'success'
                    ? { opacity: 0, scale: 0.5, filter: 'blur(4px)' }
                    : { opacity: 1 }
                }
                animate={
                  status === 'success'
                    ? { opacity: 1, scale: 1.15, filter: 'blur(0px)' }
                    : { opacity: 1, scale: 1, y: 0 }
                }
                exit={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
                className={cn(
                  "absolute inset-0 flex items-center justify-center",
                  status === 'saved' ? `${cfg.gap} ${cfg.padding}` : ''
                )}
              >
                <motion.div
                  layout
                  animate={{
                    color: getCheckColor(),
                  }}
                >
                  <BsCheckCircleFill className={cn(cfg.icon, "z-20")} />
                </motion.div>

                <AnimatePresence mode="popLayout">
                  {status === 'saved' && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.1 }}
                      className={cn(
                        "font-bold tracking-tight whitespace-nowrap z-20 text-zinc-900 dark:text-zinc-400",
                        cfg.text
                      )}
                    >
                      {savedText}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </MotionConfig>
    </div>
  );
};
