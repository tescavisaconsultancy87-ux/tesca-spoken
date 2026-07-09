'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  CreditCard,
  PhoneCall,
  MessageSquare,
  Settings as SettingsIcon,
  Home,
  Video,
  FileText,
  GraduationCap,
  Megaphone,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import type { NavGroup } from '@/components/dashboard/DashboardSidebar';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/db';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [navGroups, setNavGroups] = useState<NavGroup[]>([]);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'admin') {
        router.push('/login');
      } else if (user.needsPasswordChange) {
        router.push('/change-password');
      }
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function loadCounts() {
      try {
        const studentsList = await db.getStudents();
        const leadsList = await db.getLeads();
        
        const studentCount = studentsList.length;
        const pendingLeadsCount = leadsList.filter((l: any) => l.status !== 'converted' && l.status !== 'rejected').length;

        const updatedGroups: NavGroup[] = [
          {
            title: 'Management',
            items: [
              { label: 'Overview', href: '/admin', icon: LayoutDashboard },
              { label: 'Users & Directory', href: '/admin/students', icon: Users, badge: studentCount },
              { label: 'Courses', href: '/admin/courses', icon: BookOpen },
              { label: 'Payments', href: '/admin/payments', icon: CreditCard },
              { label: 'Leads & Inquiries', href: '/admin/leads', icon: PhoneCall, badge: pendingLeadsCount },
            ],
          },
          {
            title: 'Content & Settings',
            items: [
              { label: 'Manage Tutors', href: '/admin/tutors', icon: GraduationCap },
              { label: 'Live Classes', href: '/admin/live-classes', icon: Video },
              { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
              { label: 'Blog Posts', href: '/admin/blog', icon: FileText },
              { label: 'Offer Banner Settings', href: '/admin/banner', icon: Megaphone },
              { label: 'Global Settings', href: '/admin/settings', icon: SettingsIcon },
              { label: 'Back to Home', href: '/', icon: Home },
            ],
          },
        ];
        setNavGroups(updatedGroups);
      } catch (err) {
        console.error('Failed to load nav badge counts:', err);
      }
    }
    
    if (user && user.role === 'admin') {
      loadCounts();
    }
  }, [user]);

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

  const displayGroups = navGroups.length > 0 ? navGroups : [
    {
      title: 'Management',
      items: [
        { label: 'Overview', href: '/admin', icon: LayoutDashboard },
        { label: 'Users & Directory', href: '/admin/students', icon: Users, badge: 0 },
        { label: 'Courses', href: '/admin/courses', icon: BookOpen },
        { label: 'Payments', href: '/admin/payments', icon: CreditCard },
        { label: 'Leads & Inquiries', href: '/admin/leads', icon: PhoneCall, badge: 0 },
      ],
    },
    {
      title: 'Content & Settings',
      items: [
        { label: 'Manage Tutors', href: '/admin/tutors', icon: GraduationCap },
        { label: 'Live Classes', href: '/admin/live-classes', icon: Video },
        { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
        { label: 'Blog Posts', href: '/admin/blog', icon: FileText },
        { label: 'Offer Banner Settings', href: '/admin/banner', icon: Megaphone },
        { label: 'Global Settings', href: '/admin/settings', icon: SettingsIcon },
        { label: 'Back to Home', href: '/', icon: Home },
      ],
    },
  ];

  return (
    <DashboardLayout role="admin" navGroups={displayGroups}>
      {children}
    </DashboardLayout>
  );
}
