'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Video, FileText, Home, Users } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import type { NavGroup } from '@/components/dashboard/DashboardSidebar';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';

const tutorNavGroups: NavGroup[] = [
  {
    title: 'Content Management',
    items: [
      { label: 'Overview', href: '/tutor', icon: LayoutDashboard },
      { label: 'Courses', href: '/tutor/courses', icon: BookOpen },
      { label: 'Live Classes', href: '/tutor/live-classes', icon: Video },
      { label: 'Study Materials', href: '/tutor/materials', icon: FileText },
      { label: 'Batches', href: '/tutor/batches', icon: Users },
    ],
  },
  {
    title: 'Settings',
    items: [
      { label: 'Back to Home', href: '/', icon: Home },
    ],
  },
];

export default function TutorLayoutClient({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [checkingMaintenance, setCheckingMaintenance] = useState(true);

  useEffect(() => {
    async function checkGates() {
      if (!loading) {
        if (!user || user.role !== 'tutor') {
          router.push('/login');
          return;
        }

        try {
          const settings = await db.getSystemSettings();
          if (settings.maintenanceMode) {
            router.push('/maintenance');
            return;
          }
          setCheckingMaintenance(false);
        } catch (e) {
          console.error('[Tutor Layout] Maintenance gate check failed:', e);
          setCheckingMaintenance(false);
        }

        if (user.needsPasswordChange) {
          router.push('/change-password');
        }
      }
    }
    checkGates();
  }, [user, loading, router, pathname]);

  if (loading || checkingMaintenance) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f6fa]">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary/20 border-t-primary" />
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3">Verifying session...</p>
      </div>
    );
  }

  if (!user || user.role !== 'tutor') {
    return null;
  }

  return (
    <DashboardLayout role="tutor" navGroups={tutorNavGroups}>
      {children}
    </DashboardLayout>
  );
}
