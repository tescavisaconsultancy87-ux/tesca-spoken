export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastOptions {
  message: string;
  title?: string;
  duration?: number;
}

export const toast = {
  success: (message: string, title?: string, duration?: number) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('tesca-toast', {
          detail: { type: 'success', message, title, duration },
        })
      );
    }
  },
  error: (message: string, title?: string, duration?: number) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('tesca-toast', {
          detail: { type: 'error', message, title, duration },
        })
      );
    }
  },
  info: (message: string, title?: string, duration?: number) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('tesca-toast', {
          detail: { type: 'info', message, title, duration },
        })
      );
    }
  },
  warning: (message: string, title?: string, duration?: number) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('tesca-toast', {
          detail: { type: 'warning', message, title, duration },
        })
      );
    }
  },
};

export default toast;
