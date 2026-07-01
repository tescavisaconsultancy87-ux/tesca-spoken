'use client';

import { useEffect } from 'react';

export default function OfferBanner() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.style.setProperty('--banner-height', '0px');
    }
  }, []);

  return null;
}

