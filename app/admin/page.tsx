'use client';

import { useState, useEffect } from 'react';
import { Users, CreditCard, IndianRupee, PhoneCall, TrendingUp, UserPlus, BookOpen, Video, FileText, ArrowRight, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import StatCard from '@/components/dashboard/StatCard';
import AnalyticsChart from '@/components/dashboard/AnalyticsChart';
import ProgressRing from '@/components/dashboard/ProgressRing';
import ActivityList from '@/components/dashboard/ActivityList';
import { db } from '@/lib/db';

export default function AdminDashboardHome() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    pendingLeads: 0,
    conversionRate: 0,
    newStudentsThisMonth: 0,
  });
  const [targets, setTargets] = useState({
    salesTarget: 10000,
    enrollmentTarget: 10,
    conversionTarget: 50,
  });
  const [isGoalsExpanded, setIsGoalsExpanded] = useState(false);
  const [loading, setLoading] = useState(true);
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const getInitialChartData = () => {
    const data = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({
        label: months[d.getMonth()],
        value: 0,
        secondaryValue: 1500
      });
    }
    return data;
  };

  const [chartData, setChartData] = useState(getInitialChartData());
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    // Load targets
    const savedGoals = localStorage.getItem('tesca_admin_goals');
    if (savedGoals) {
      try {
        setTargets(JSON.parse(savedGoals));
      } catch (err) {
        console.error('Failed to parse saved targets:', err);
      }
    }

    async function loadStats() {
      try {
        const studentsList = await db.getStudents();
        const leadsList = await db.getLeads();
        const paymentsList = await db.getPayments();

        const totalStudents = studentsList.length;
        const pendingLeads = leadsList.filter((l: any) => l.status !== 'converted' && l.status !== 'rejected').length;
        const convertedLeads = leadsList.filter((l: any) => l.status === 'converted').length;
        const totalLeads = leadsList.length;
        const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
        
        const successfulPayments = paymentsList.filter((p: any) => p.status === 'success');

        // Group actual payments by month for chart
        const now = new Date();
        const last6Months: Array<{ label: string; year: number; monthNum: number; value: number; secondaryValue: number }> = [];
        for (let i = 5; i >= 0; i--) {
          const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
          last6Months.push({
            label: months[d.getMonth()],
            year: d.getFullYear(),
            monthNum: d.getMonth(),
            value: 0,
            secondaryValue: 0
          });
        }

        successfulPayments.forEach((p: any) => {
          try {
            const dateStr = p.created_at || p.date;
            if (!dateStr) return;
            const pDate = new Date(dateStr);
            if (isNaN(pDate.getTime())) return;
            
            const pMonth = pDate.getMonth();
            const pYear = pDate.getFullYear();
            
            const found = last6Months.find(m => m.monthNum === pMonth && m.year === pYear);
            if (found) {
              found.value += Number(p.amount);
            }
          } catch (e) {
            console.error('Failed to parse payment date:', p, e);
          }
        });

        last6Months.forEach(m => {
          m.secondaryValue = Math.max(1500, Math.round(m.value * 1.25));
        });

        setChartData(last6Months.map(m => ({
          label: m.label,
          value: m.value,
          secondaryValue: m.secondaryValue
        })));

        // Count new student enrollments for current month
        const currentMonthShort = months[now.getMonth()];
        const currentYearStr = String(now.getFullYear());
        const newStudentsThisMonth = studentsList.filter((s: any) => {
          const joined = s.joinedDate || '';
          return joined.includes(currentMonthShort) && joined.includes(currentYearStr);
        }).length;

        // Calculate current month revenue
        const currentMonthNum = now.getMonth();
        const currentYearNum = now.getFullYear();
        const currentMonthRevenue = successfulPayments
          .filter((p: any) => {
            const pDate = new Date(p.created_at || p.date);
            return pDate.getMonth() === currentMonthNum && pDate.getFullYear() === currentYearNum;
          })
          .reduce((acc: number, cur: any) => acc + Number(cur.amount), 0);

        setStats({
          totalStudents,
          activeSubscriptions: totalStudents, // Assuming all registered profiles are active students
          monthlyRevenue: currentMonthRevenue,
          pendingLeads,
          conversionRate,
          newStudentsThisMonth,
        });

        // Dynamic Activities
        const dbActivities: any[] = [];
        if (studentsList.length > 0) {
          const latestStudent = studentsList[0];
          dbActivities.push({
            id: `act-stud-${latestStudent.id}`,
            title: 'New Student Enrolled',
            description: `${latestStudent.name} enrolled in ${latestStudent.course}.`,
            time: latestStudent.joinedDate || 'Recently',
            icon: UserPlus,
            status: 'success' as const
          });
        }

        if (successfulPayments.length > 0) {
          const latestPayment = successfulPayments[0];
          dbActivities.push({
            id: `act-pay-${latestPayment.id}`,
            title: 'Payment Received',
            description: `Received ₹${Number(latestPayment.amount).toLocaleString('en-IN')} subscription payment from ${latestPayment.student_name}.`,
            time: latestPayment.date || 'Recently',
            icon: CreditCard,
            status: 'info' as const
          });
        }

        const newLeadsList = leadsList.filter((l: any) => l.status === 'new' || l.status === 'processing' || l.status === 'followup');
        if (newLeadsList.length > 0) {
          const latestLead = newLeadsList[0];
          dbActivities.push({
            id: `act-lead-${latestLead.id}`,
            title: 'Lead Update',
            description: `Lead "${latestLead.name}" is currently in "${latestLead.status}" state.`,
            time: latestLead.date_added || 'Recently',
            icon: PhoneCall,
            status: 'warning' as const
          });
        }

        if (dbActivities.length === 0) {
          dbActivities.push({
            id: 'act-default',
            title: 'System Active',
            description: 'TESCA Spoken English database connected successfully.',
            time: 'Just now',
            icon: UserPlus,
            status: 'success' as const
          });
        }
        setActivities(dbActivities);

      } catch (err) {
        console.error('Failed to load dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const currentMonthName = new Date().toLocaleString('en-IN', { month: 'long' });
  const salesGoalProgress = targets.salesTarget > 0 ? Math.min(100, Math.round((stats.monthlyRevenue / targets.salesTarget) * 100)) : 0;
  const enrollmentGoalProgress = targets.enrollmentTarget > 0 ? Math.min(100, Math.round((stats.newStudentsThisMonth / targets.enrollmentTarget) * 100)) : 0;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-3 animate-pulse">Loading Admin Statistics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header control panel banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Admin Overview</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Control panel for managing student profiles, course content, payments, and leads</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-white border border-gray-150 rounded-xl px-4 py-2.5 shadow-soft self-start md:self-auto">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          System Active: {loading ? '...' : stats.totalStudents} Student{stats.totalStudents !== 1 ? 's' : ''} Online
        </div>
      </div>

      {/* Admin stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          label="Total Students"
          value={loading ? '...' : stats.totalStudents.toLocaleString()}
          trend={{ value: 8.2, isPositive: true }}
          description="active learners"
          icon={Users}
          color="primary"
        />
        <StatCard
          label="Active Subscriptions"
          value={loading ? '...' : stats.activeSubscriptions.toLocaleString()}
          trend={{ value: 12.4, isPositive: true }}
          description="recurring accounts"
          icon={CreditCard}
          color="secondary"
        />
        <StatCard
          label="Monthly Revenue"
          value={loading ? '...' : "₹" + stats.monthlyRevenue.toLocaleString('en-IN')}
          trend={{ value: 14.1, isPositive: true }}
          description={`${currentMonthName} revenue`}
          icon={IndianRupee}
          color="indigo"
        />
        <StatCard
          label="Pending Leads"
          value={loading ? '...' : `${stats.pendingLeads} Lead${stats.pendingLeads !== 1 ? 's' : ''}`}
          trend={{ value: 25, isPositive: false }}
          description="requires follow up"
          icon={PhoneCall}
          color="accent"
        />
      </div>

      {/* Quick Action Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Link href="/admin/students" className="group bg-white border border-gray-100 rounded-3xl p-5 shadow-soft hover:shadow-lg transition-all duration-300 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">Directories</h3>
              <p className="text-[10px] text-gray-400 font-medium">Manage Users</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </Link>
        <Link href="/admin/payments" className="group bg-white border border-gray-100 rounded-3xl p-5 shadow-soft hover:shadow-lg transition-all duration-300 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">Payments</h3>
              <p className="text-[10px] text-gray-400 font-medium">View Transactions</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
        </Link>
        <Link href="/admin/leads" className="group bg-white border border-gray-100 rounded-3xl p-5 shadow-soft hover:shadow-lg transition-all duration-300 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 group-hover:text-amber-600 transition-colors">Leads</h3>
              <p className="text-[10px] text-gray-400 font-medium">Track Inquiries</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
        </Link>
        <Link href="/admin/testimonials" className="group bg-white border border-gray-100 rounded-3xl p-5 shadow-soft hover:shadow-lg transition-all duration-300 flex items-center justify-between cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-800 group-hover:text-rose-600 transition-colors">Reviews</h3>
              <p className="text-[10px] text-gray-400 font-medium">Testimonials</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-rose-600 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Main content split sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts & Graphs Column */}
        <div className="lg:col-span-2 space-y-6">
          <AnalyticsChart
            title="Monthly Revenue Growth"
            subtitle="Current year revenue vs. target forecast (INR)"
            data={chartData}
            type="bar"
            valuePrefix="₹"
            color="primary"
          />

          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-soft space-y-4">
            <h3 className="text-base font-bold text-gray-800">Quick System Metrics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-50 rounded-2xl bg-gray-50/50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Average Session Duration</p>
                <p className="text-lg font-bold text-gray-705 mt-1">42 mins</p>
              </div>
              <div className="p-4 border border-gray-50 rounded-2xl bg-gray-50/50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Class Completion Rate</p>
                <p className="text-lg font-bold text-gray-750 mt-1">88.5%</p>
              </div>
              <div className="p-4 border border-gray-50 rounded-2xl bg-gray-50/50">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Daily Active Users</p>
                <p className="text-lg font-bold text-gray-780 mt-1">{loading ? '...' : `${Math.max(1, Math.round(stats.totalStudents * 0.65))} DAU`}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action center column */}
        <div className="space-y-6 flex flex-col justify-between">
          <div>
            <div className="grid grid-cols-3 gap-2.5">
              <ProgressRing
                title="Sales Goal"
                percentage={loading ? 0 : salesGoalProgress}
                subtitle={`Target: ₹${targets.salesTarget.toLocaleString()}`}
                color="secondary"
                size={105}
              />
              <ProgressRing
                title="Enrollments"
                percentage={loading ? 0 : enrollmentGoalProgress}
                subtitle={`Target: ${targets.enrollmentTarget}`}
                color="emerald"
                size={105}
              />
              <ProgressRing
                title="Conversion"
                percentage={loading ? 0 : stats.conversionRate}
                subtitle={`Target: ${targets.conversionTarget}%`}
                color="primary"
                size={105}
              />
            </div>

            {/* Target Settings Expandable Card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-4 shadow-soft mt-4">
              <button
                type="button"
                onClick={() => setIsGoalsExpanded(!isGoalsExpanded)}
                className="w-full flex items-center justify-between text-[11px] font-bold text-gray-700 hover:text-primary transition-colors uppercase tracking-wider"
              >
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  🎯 Set Monthly Targets
                </span>
                <span className="text-gray-400">{isGoalsExpanded ? 'Hide' : 'Configure'}</span>
              </button>

              {isGoalsExpanded && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    localStorage.setItem('tesca_admin_goals', JSON.stringify(targets));
                    setIsGoalsExpanded(false);
                  }}
                  className="space-y-3 pt-3 mt-3 border-t border-gray-50 animate-scale-up"
                >
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Sales Target (₹)</label>
                    <input
                      type="number"
                      value={targets.salesTarget}
                      onChange={(e) => setTargets({ ...targets, salesTarget: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none transition-colors"
                      min="1"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Enrollment Target (Students)</label>
                    <input
                      type="number"
                      value={targets.enrollmentTarget}
                      onChange={(e) => setTargets({ ...targets, enrollmentTarget: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none transition-colors"
                      min="1"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Target Conversion Rate (%)</label>
                    <input
                      type="number"
                      value={targets.conversionTarget}
                      onChange={(e) => setTargets({ ...targets, conversionTarget: Number(e.target.value) })}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none transition-colors"
                      min="1"
                      max="100"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-primary text-white text-[11px] font-bold hover:bg-primary-600 shadow-soft transition-colors"
                  >
                    Save Target Config
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="flex-1 mt-4 lg:mt-0">
            <ActivityList title="Recent System Activities" activities={activities} />
          </div>
        </div>
      </div>
    </div>
  );
}
