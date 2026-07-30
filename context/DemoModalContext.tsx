'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import DemoModal from '@/components/DemoModal';

interface DemoModalActionsContextType {
  openModal: () => void;
  closeModal: () => void;
}

interface DemoModalStateContextType {
  isOpen: boolean;
}

const DemoModalActionsContext = createContext<DemoModalActionsContextType | undefined>(undefined);
const DemoModalStateContext = createContext<DemoModalStateContextType | undefined>(undefined);

export function DemoModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkDemoParam = () => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('demo') === 'true') {
          setIsOpen(true);
          const newUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({ path: newUrl }, '', newUrl);
        }
      };

      checkDemoParam();
      window.addEventListener('popstate', checkDemoParam);
      return () => window.removeEventListener('popstate', checkDemoParam);
    }
  }, []);

  return (
    <DemoModalActionsContext.Provider value={{ openModal, closeModal }}>
      <DemoModalStateContext.Provider value={{ isOpen }}>
        {children}
        {isOpen && <DemoModal onClose={closeModal} />}
      </DemoModalStateContext.Provider>
    </DemoModalActionsContext.Provider>
  );
}

export function useDemoModal() {
  const context = useContext(DemoModalActionsContext);
  if (!context) {
    throw new Error('useDemoModal must be used within a DemoModalProvider');
  }
  return context;
}

export function useDemoModalState() {
  const context = useContext(DemoModalStateContext);
  if (!context) {
    throw new Error('useDemoModalState must be used within a DemoModalProvider');
  }
  return context;
}
