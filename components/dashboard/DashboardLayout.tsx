'use client';

import { useState, useEffect } from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardTopBar from './DashboardTopBar';
import type { NavGroup } from './DashboardSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'student' | 'admin' | 'tutor';
  navGroups: NavGroup[];
}

export default function DashboardLayout({ children, role, navGroups }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Safely initialize state from localStorage on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar_collapsed');
      if (saved) {
        setIsCollapsed(saved === 'true');
      }
    }
  }, []);

  const handleToggleCollapse = () => {
    const nextVal = !isCollapsed;
    setIsCollapsed(nextVal);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar_collapsed', String(nextVal));
    }
  };

  return (
    <div className="flex h-screen bg-[#f5f6fa] overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar
        groups={navGroups}
        role={role}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardTopBar
          role={role}
          onMenuToggle={() => setSidebarOpen(true)}
        />

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
