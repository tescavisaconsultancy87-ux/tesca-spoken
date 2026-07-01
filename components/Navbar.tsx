'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, CalendarCheck, LogIn } from 'lucide-react';
import { NAV_LINKS, WHATSAPP_URL } from '@/lib/data/content';
import { useDemoModal } from '@/context/DemoModalContext';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const pathname = usePathname();
  const { openModal } = useDemoModal();
  const isDarkBg = false;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? 'bg-white border-b border-black/5 shadow-soft'
          : 'bg-transparent'
      }`}
      style={{ top: 'var(--banner-height, 36px)' }}
    >
      <nav className="container-x flex h-14 items-center justify-between py-2 lg:h-16">
        <Link href="/" className="group flex items-center gap-2" aria-label="TESCA home">
          <img src="/Tesca_logo.png" alt="TESCA Logo" className="h-8 lg:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]" />
        </Link>

        {/* Desktop nav */}
        <ul 
          className="hidden items-center gap-1 lg:flex"
          onMouseLeave={() => setHoveredLink(null)}
        >
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const isHighlight = hoveredLink ? hoveredLink === link.href : isActive;
            return (
              <li key={link.href} className="relative">
                <Link
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  className={`group relative px-4 py-2 text-sm font-semibold transition-colors duration-300 block rounded-full ${
                    isHighlight 
                      ? 'text-white' 
                      : isDarkBg 
                        ? 'text-white/85 hover:text-white' 
                        : 'text-ink-soft hover:text-ink'
                  }`}
                >
                  <span className="relative z-10 inline-flex items-center gap-1 transition-transform duration-300 group-hover:scale-[1.02]">
                    {link.label}
                  </span>
                  
                  {isHighlight && (
                    <motion.span
                      layoutId="nav-hover-backdrop"
                      className={`absolute inset-0 rounded-full shadow-[0_4px_14px_rgba(6,119,121,0.12)] ${
                        isActive
                          ? 'bg-primary-900 border border-primary-800/50'
                          : 'bg-primary-800/90 border border-primary-700/30'
                      }`}
                      transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-4 lg:flex">
          <button onClick={openModal} className="btn-warm text-sm cursor-pointer">
            <CalendarCheck className="h-4 w-4" />
            Book Free Demo
          </button>
          <Link
            href="/login"
            className={`inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${
              isDarkBg ? 'text-white/85 hover:text-white' : 'text-ink-soft hover:text-primary'
            }`}
          >
            <LogIn className="h-4 w-4" />
            Login
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className={`inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-bg-soft lg:hidden ${
            isDarkBg ? 'text-white' : 'text-ink'
          }`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden bg-white border-t border-black/5 transition-all duration-500 lg:hidden ${
          menuOpen ? 'max-h-[480px]' : 'max-h-0'
        }`}
      >
        <ul className="space-y-1 p-5">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary'
                      : 'text-ink-soft hover:bg-primary-50 hover:text-primary'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
          <li className="flex gap-3 pt-3">
            <button
              onClick={() => {
                setMenuOpen(false);
                openModal();
              }}
              className="btn-warm flex-1 cursor-pointer"
            >
              <CalendarCheck className="h-4 w-4" />
              Demo
            </button>
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="btn-secondary flex-1"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </li>
          <li>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="btn-primary w-full"
            >
              WhatsApp Us
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
