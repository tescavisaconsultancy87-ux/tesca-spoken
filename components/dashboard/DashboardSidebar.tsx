'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, LogOut, PanelLeft, PanelRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

interface SidebarProps {
  groups: NavGroup[];
  role: 'student' | 'admin' | 'tutor';
  open: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function DashboardSidebar({ groups, role, open, onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  
  const [readHrefs, setReadHrefs] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('read_badges');
      if (saved) {
        try {
          setReadHrefs(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  const markAsRead = (href: string) => {
    const updated = { ...readHrefs, [href]: true };
    setReadHrefs(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('read_badges', JSON.stringify(updated));
    }
  };

  const isActive = (href: string) => {
    if (href === `/${role}`) return pathname === `/${role}`;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-100
          flex flex-col transition-all duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'lg:w-[80px]' : 'lg:w-[260px]'}
          w-[260px]
        `}
      >
        {/* Logo + close/collapse button */}
        <div className={`flex border-b border-gray-100 py-5 ${isCollapsed ? 'flex-col items-center gap-4 px-2' : 'items-center justify-between px-6'}`}>
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            {isCollapsed ? (
              <img src="/favicon.png" alt="TESCA" className="h-8 w-8 object-contain transition-all duration-300" />
            ) : (
              <img src="/Tesca_logo.png" alt="TESCA" className="h-8 w-auto object-contain transition-all duration-300" />
            )}
          </Link>
          <div className={`flex ${isCollapsed ? 'flex-col items-center gap-2' : 'items-center gap-1'}`}>
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <PanelRight className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
            </button>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6 no-scrollbar">
          {groups.map((group) => (
            <div key={group.title}>
              {isCollapsed ? (
                <div className="h-px bg-gray-100 my-4 mx-3" />
              ) : (
                <p className="px-3 mb-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                  {group.title}
                </p>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  const showBadge = item.badge !== undefined && item.badge > 0 && !active && !readHrefs[item.href];
                  
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={() => {
                          onClose();
                          markAsRead(item.href);
                        }}
                        title={isCollapsed ? item.label : undefined}
                        className={`
                          group relative flex items-center rounded-xl text-sm font-medium
                          transition-all duration-200
                          ${isCollapsed ? 'justify-center p-2.5 mx-auto w-10 h-10' : 'gap-3 px-3 py-2.5'}
                          ${active
                            ? 'bg-primary-50 text-primary font-semibold'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                          }
                        `}
                      >
                        {/* Active indicator bar */}
                        {active && (
                          <span className={`absolute left-0 top-1/2 -translate-y-1/2 bg-primary rounded-r-full ${isCollapsed ? 'w-[4px] h-5' : 'w-[3px] h-6'}`} />
                        )}
                        <Icon className={`h-[18px] w-[18px] flex-shrink-0 ${active ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'}`} />
                        {!isCollapsed && <span className="truncate">{item.label}</span>}
                        
                        {!isCollapsed && showBadge && (
                          <span className="ml-auto inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-secondary text-white text-[10px] font-bold px-1.5">
                            {item.badge}
                          </span>
                        )}
                        
                        {isCollapsed && showBadge && (
                          <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-secondary ring-2 ring-white animate-in fade-in zoom-in-95 duration-205" />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom: User card */}
        <div className={`border-t border-gray-100 py-4 ${isCollapsed ? 'px-2' : 'px-4'}`}>
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-3">
              <div
                className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                title={user?.name || (role === 'admin' ? 'Admin User' : role === 'tutor' ? 'Tutor User' : 'Student User')}
              >
                {user?.name ? user.name[0].toUpperCase() : (role === 'admin' ? 'A' : role === 'tutor' ? 'T' : 'S')}
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50">
              <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                {user?.name ? user.name[0].toUpperCase() : (role === 'admin' ? 'A' : role === 'tutor' ? 'T' : 'S')}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user?.name || (role === 'admin' ? 'Admin User' : role === 'tutor' ? 'Tutor User' : 'Student User')}
                </p>
                <p className="text-[11px] text-gray-450 truncate">
                  {user?.email || (role === 'admin' ? 'admin@tesca.com' : role === 'tutor' ? 'tutor@tesca.com' : 'student@tesca.com')}
                </p>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
