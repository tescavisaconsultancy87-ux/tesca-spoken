'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  PhoneCall,
  MessageSquare,
  PenTool,
  Settings as SettingsIcon,
  Home,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import type { NavGroup } from '@/components/dashboard/DashboardSidebar';
import { useAuth } from '@/context/AuthContext';

const adminNavGroups: NavGroup[] = [
  {
    title: 'Management',
    items: [
      { label: 'Overview', href: '/admin', icon: LayoutDashboard },
      { label: 'Students', href: '/admin/students', icon: Users, badge: 142 },
      { label: 'Courses', href: '/admin/courses', icon: BookOpen },
      { label: 'Payments', href: '/admin/payments', icon: CreditCard },
      { label: 'Leads & Inquiries', href: '/admin/leads', icon: PhoneCall, badge: 8 },
    ],
  },
  {
    title: 'Content & Settings',
    items: [
      { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
      { label: 'Blog Posts', href: '/admin/blog', icon: PenTool },
      { label: 'Global Settings', href: '/admin/settings', icon: SettingsIcon },
      { label: 'Back to Home', href: '/', icon: Home },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f6fa]">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-primary/20 border-t-primary" />
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3">Verifying session...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <DashboardLayout role="admin" navGroups={adminNavGroups}>
      {children}
    </DashboardLayout>
  );
}
