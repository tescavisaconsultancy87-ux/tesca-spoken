'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import DemoModal from '@/components/DemoModal';

interface DemoModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const DemoModalContext = createContext<DemoModalContextType | undefined>(undefined);

export function DemoModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkDemoParam = () => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('demo') === 'true') {
          setIsOpen(true);
          // Clean up the URL parameter without reloading
          const newUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({ path: newUrl }, '', newUrl);
        }
      };
      
      checkDemoParam();
      // Listen for popstate changes too (e.g., back navigation)
      window.addEventListener('popstate', checkDemoParam);
      return () => window.removeEventListener('popstate', checkDemoParam);
    }
  }, []);

  return (
    <DemoModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      {isOpen && <DemoModal onClose={closeModal} />}
    </DemoModalContext.Provider>
  );
}

export function useDemoModal() {
  const context = useContext(DemoModalContext);
  if (!context) {
    throw new Error('useDemoModal must be used within a DemoModalProvider');
  }
  return context;
}
