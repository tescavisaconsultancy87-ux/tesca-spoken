'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X, LogOut } from 'lucide-react';
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
  role: 'student' | 'admin';
  open: boolean;
  onClose: () => void;
}

export default function DashboardSidebar({ groups, role, open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

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
          fixed top-0 left-0 z-50 h-screen w-[260px] bg-white border-r border-gray-100
          flex flex-col transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo + close button */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <Link href="/" className="flex items-center gap-2.5">
            <img src="/Tesca_logo.png" alt="TESCA" className="h-8 w-auto object-contain" />
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="px-3 mb-2 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                {group.title}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`
                          group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                          transition-all duration-200
                          ${active
                            ? 'bg-primary-50 text-primary font-semibold'
                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                          }
                        `}
                      >
                        {/* Active indicator bar */}
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-primary rounded-r-full" />
                        )}
                        <Icon className={`h-[18px] w-[18px] flex-shrink-0 ${active ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500'}`} />
                        <span>{item.label}</span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="ml-auto inline-flex items-center justify-center h-5 min-w-[20px] rounded-full bg-secondary text-white text-[10px] font-bold px-1.5">
                            {item.badge}
                          </span>
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
        <div className="border-t border-gray-100 px-4 py-4">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50">
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {(user?.name || (role === 'admin' ? 'A' : 'S'))[0]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-800 truncate">
                {user?.name || (role === 'admin' ? 'Admin User' : 'Student User')}
              </p>
              <p className="text-[11px] text-gray-450 truncate">
                {user?.email || (role === 'admin' ? 'admin@tesca.com' : 'student@tesca.com')}
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
        </div>
      </aside>
    </>
  );
}
