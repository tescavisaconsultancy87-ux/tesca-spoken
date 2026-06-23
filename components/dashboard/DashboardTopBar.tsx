'use client';

import { useState, useEffect } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/animate-ui/primitives/radix/dropdown-menu';

interface TopBarProps {
  role: 'student' | 'admin';
  onMenuToggle: () => void;
}

export default function DashboardTopBar({ role, onMenuToggle }: TopBarProps) {
  const [notifications, setNotifications] = useState<Array<{ id: string; text: string; time: string; unread: boolean }>>([]);

  useEffect(() => {
    setNotifications(
      role === 'admin'
        ? [
            { id: 'n1', text: 'New student enrolled today.', time: '10 mins ago', unread: true },
            { id: 'n2', text: 'Subscription payment of ₹2,499.00 received.', time: '45 mins ago', unread: true },
            { id: 'n3', text: 'Vikram Singh registered as a new lead.', time: '2 hours ago', unread: false },
          ]
        : [
            { id: 'n1', text: 'Live Class: "Fluency Practice" starts soon.', time: '15 mins', unread: true },
            { id: 'n2', text: 'Lesson 5 study material has been unlocked.', time: '2 hours ago', unread: true },
            { id: 'n3', text: 'Welcome to TESCA Spoken English!', time: '1 day ago', unread: false },
          ]
    );
  }, [role]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  const handleMarkSingleRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Left: hamburger + search */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 w-[280px] lg:w-[340px]">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={role === 'admin' ? 'Search students, courses...' : 'Search courses, lessons...'}
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
            />
            <kbd className="hidden lg:inline-flex items-center gap-0.5 rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
              ⌘F
            </kbd>
          </div>
        </div>

        {/* Right: actions + profile */}
        <div className="flex items-center gap-2">
          {/* Mobile search */}
          <button className="sm:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
            <Search className="h-5 w-5" />
          </button>

          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="relative p-2.5 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors cursor-pointer flex items-center justify-center">
                <Bell className="h-[18px] w-[18px]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-secondary ring-2 ring-white" />
                )}
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80 bg-white border border-gray-100 rounded-2xl shadow-soft-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-50 flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">Notifications</h4>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-[10px] font-bold text-primary hover:text-primary-600 transition-colors cursor-pointer mr-1"
                    >
                      Mark all read
                    </button>
                  )}
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold text-secondary bg-secondary-50 px-2 py-0.5 rounded">
                      {unreadCount} New
                    </span>
                  )}
                </div>
              </div>
              <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-gray-400">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => handleMarkSingleRead(notif.id)}
                      className="w-full px-4 py-3 hover:bg-gray-50/50 transition-colors text-left block cursor-pointer focus:outline-none"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <p className={`text-xs ${notif.unread ? 'font-bold text-gray-800' : 'text-gray-600'}`}>
                          {notif.text}
                        </p>
                        {notif.unread && (
                          <span className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0 mt-1" />
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium mt-1 block">{notif.time}</span>
                    </button>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Divider */}
          <div className="hidden sm:block w-px h-8 bg-gray-100 mx-1" />

          {/* Profile */}
          <button className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-800 leading-tight">
                {role === 'admin' ? 'Admin User' : 'Student User'}
              </p>
              <p className="text-[11px] text-gray-400 leading-tight">
                {role === 'admin' ? 'admin@tesca.com' : 'student@tesca.com'}
              </p>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
              {role === 'admin' ? 'A' : 'S'}
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
