'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Bell, Menu, Trash2, CheckCheck, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase, ensureSupabaseClient } from '@/lib/supabaseClient';
import toast from '@/lib/toast';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuHighlight,
  DropdownMenuHighlightItem,
  DropdownMenuItem,
} from '@/components/animate-ui/primitives/radix/dropdown-menu';

interface TopBarProps {
  role: 'student' | 'admin' | 'tutor';
  onMenuToggle: () => void;
}

export default function DashboardTopBar({ role, onMenuToggle }: TopBarProps) {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState<Array<{ id: string; text: string; time: string; unread: boolean }>>([]);

  useEffect(() => {
    async function fetchNotifications() {
      let loadedNotifications: any[] = [];
      try {
        await ensureSupabaseClient();
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.access_token) {
            const res = await fetch('/api/notifications', {
              headers: {
                'Authorization': `Bearer ${session.access_token}`
              }
            });
            if (res.ok) {
              loadedNotifications = await res.json();
            }
          }
        }
      } catch (err) {
        console.warn('Failed to fetch from notifications API:', err);
      }

      // Filter out notifications cleared or read locally by user
      const readIds: string[] = JSON.parse(localStorage.getItem('read_notifications') || '[]');
      const deletedIds: string[] = JSON.parse(localStorage.getItem('deleted_notifications') || '[]');

      const filteredNotifications = (loadedNotifications || [])
        .filter((n: any) => !deletedIds.includes(n.id))
        .map((n: any) => ({
          ...n,
          unread: readIds.includes(n.id) ? false : n.unread,
        }));

      setNotifications(filteredNotifications);
    }

    fetchNotifications();
  }, [role]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = notifications.map((n) => ({ ...n, unread: false }));
    setNotifications(updated);
    const readIds = updated.filter(n => !n.unread).map(n => n.id);
    localStorage.setItem('read_notifications', JSON.stringify(readIds));

    try {
      await ensureSupabaseClient();
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          await fetch('/api/notifications', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ markAllRead: true })
          });
        }
      }
    } catch (err) {
      console.warn('Failed to post markAllRead:', err);
    }
  };

  const handleMarkSingleRead = async (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, unread: false } : n));
    setNotifications(updated);
    const readIds = updated.filter(n => !n.unread).map(n => n.id);
    localStorage.setItem('read_notifications', JSON.stringify(readIds));

    try {
      await ensureSupabaseClient();
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          await fetch('/api/notifications', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ notificationId: id })
          });
        }
      }
    } catch (err) {
      console.warn('Failed to post single markRead:', err);
    }
  };

  const handleDeleteNotification = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);

    const deletedIds: string[] = JSON.parse(localStorage.getItem('deleted_notifications') || '[]');
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem('deleted_notifications', JSON.stringify(deletedIds));
    }

    toast.info('Notification cleared', 'Cleared');

    try {
      await ensureSupabaseClient();
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          await fetch('/api/notifications', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ notificationId: id })
          });
        }
      }
    } catch (err) {
      console.warn('Failed to delete notification:', err);
    }
  };

  const handleClearAll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const allIds = notifications.map((n) => n.id);
    setNotifications([]);

    const deletedIds: string[] = JSON.parse(localStorage.getItem('deleted_notifications') || '[]');
    const merged = Array.from(new Set([...deletedIds, ...allIds]));
    localStorage.setItem('deleted_notifications', JSON.stringify(merged));

    toast.success('All notifications cleared', 'Notifications Cleared');

    try {
      await ensureSupabaseClient();
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          await fetch('/api/notifications', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ clearAll: true })
          });
        }
      }
    } catch (err) {
      console.warn('Failed to clear all notifications:', err);
    }
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
              placeholder={role === 'admin' ? 'Search students, courses...' : role === 'tutor' ? 'Search courses, materials...' : 'Search courses, lessons...'}
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

            <DropdownMenuContent align="end" className="w-80 sm:w-84 bg-white border border-gray-100 rounded-2xl shadow-soft-xl py-2 z-50">
              <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">Notifications</h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-bold text-secondary bg-secondary-50 px-2 py-0.5 rounded-full">
                      {unreadCount} New
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-[10px] font-bold text-primary hover:text-primary-600 transition-colors cursor-pointer"
                      title="Mark all as read"
                    >
                      Mark read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      onClick={handleClearAll}
                      className="text-[10px] font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                      title="Clear all notifications"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-xs text-gray-400 font-medium">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notif, index) => (
                    <div
                      key={notif.id || index}
                      onClick={() => handleMarkSingleRead(notif.id)}
                      className="w-full px-4 py-3 hover:bg-gray-50/70 transition-colors text-left flex items-start justify-between gap-2.5 group cursor-pointer focus:outline-none"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-1.5">
                          {notif.unread && (
                            <span className="h-1.5 w-1.5 rounded-full bg-secondary shrink-0" />
                          )}
                          <p className={`text-xs leading-snug ${notif.unread ? 'font-bold text-gray-800' : 'text-gray-600 font-medium'}`}>
                            {notif.text}
                          </p>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium block">{notif.time}</span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteNotification(e, notif.id)}
                        className="opacity-70 group-hover:opacity-100 p-1 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all cursor-pointer shrink-0 mt-0.5"
                        title="Delete notification"
                        aria-label="Delete notification"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Divider */}
          <div className="hidden sm:block w-px h-8 bg-gray-100 mx-1" />

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-xl hover:bg-gray-55 transition-colors cursor-pointer">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-gray-800 leading-tight">
                    {user?.name || (role === 'admin' ? 'Admin User' : role === 'tutor' ? 'Tutor User' : 'Student User')}
                  </p>
                  <p className="text-[11px] text-gray-450 leading-tight">
                    {user?.email || (role === 'admin' ? 'admin@tesca.com' : role === 'tutor' ? 'tutor@tesca.com' : 'student@tesca.com')}
                  </p>
                </div>
                <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                  {user?.name ? user.name[0].toUpperCase() : (role === 'admin' ? 'A' : role === 'tutor' ? 'T' : 'S')}
                </div>
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48 bg-white border border-gray-100 rounded-2xl shadow-soft-xl py-2.5 z-50">
              <DropdownMenuHighlight>
                <DropdownMenuHighlightItem>
                  <Link href={role === 'admin' ? '/admin' : role === 'tutor' ? '/tutor' : '/student'}>
                    <DropdownMenuItem>
                      View Dashboard
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuHighlightItem>
                {role === 'student' && (
                  <DropdownMenuHighlightItem>
                    <Link href="/student/profile">
                      <DropdownMenuItem>
                        My Profile
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuHighlightItem>
                )}
                {role === 'admin' && (
                  <DropdownMenuHighlightItem>
                    <Link href="/admin/settings">
                      <DropdownMenuItem>
                        Portal Settings
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuHighlightItem>
                )}
                <div className="my-1.5 h-px bg-black/5" />
                <DropdownMenuHighlightItem>
                  <DropdownMenuItem onClick={logout} className="text-rose-600 hover:text-rose-600">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuHighlightItem>
              </DropdownMenuHighlight>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
