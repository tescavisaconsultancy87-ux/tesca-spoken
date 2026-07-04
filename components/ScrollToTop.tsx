'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll instantly to the top left on pathname change
    try {
      window.scrollTo(0, 0);
    } catch (err) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as any });
    }
  }, [pathname]);

  return null;
}
