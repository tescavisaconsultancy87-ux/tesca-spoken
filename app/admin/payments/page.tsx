'use client';

import { useState, useEffect } from 'react';
import { Search, Download, CreditCard, IndianRupee, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { db } from '@/lib/db';

interface Transaction {
  id: string;
  student: string;
  email: string;
  amount: number;
  date: string;
  method: string;
  status: 'success' | 'failed' | 'refunded';
}

export default function AdminPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await db.getPayments();
      const mapped = data.map((t: any) => ({
        id: t.id,
        student: t.student_name,
        email: t.email,
        amount: Number(t.amount),
        date: t.date,
        method: t.method,
        status: t.status as any,
      }));
      setTransactions(mapped);
      setLoading(false);
    }
    load();
  }, []);

  const filteredTxns = transactions.filter((t) =>
    t.student.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const successTxns = transactions.filter((t) => t.status === 'success');
  const failedTxns = transactions.filter((t) => t.status === 'failed');
  const totalSales = successTxns.reduce((sum, t) => sum + t.amount, 0);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-emerald-50 text-emerald-600';
      case 'failed':
        return 'bg-rose-50 text-rose-600';
      default:
        return 'bg-gray-50 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Payments & Billing</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Track student invoices, subscription milestones, and payout logs</p>
        </div>

        <button className="inline-flex items-center justify-center gap-1.5 px-5 py-3 border border-gray-150 hover:bg-gray-50 text-gray-700 rounded-xl text-xs font-bold transition-all shadow-soft self-start sm:self-auto bg-white">
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-100/80 rounded-2xl p-5 shadow-soft flex items-center gap-4">
          <div className="p-3.5 bg-primary-50 text-primary rounded-xl">
            <IndianRupee className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Sales (MTD)</p>
            <h3 className="text-xl font-extrabold text-gray-800 mt-0.5">
              ₹{totalSales.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>
        <div className="bg-white border border-gray-100/80 rounded-2xl p-5 shadow-soft flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Successful Invoices</p>
            <h3 className="text-xl font-extrabold text-gray-800 mt-0.5">
              {successTxns.length} Txns
            </h3>
          </div>
        </div>
        <div className="bg-white border border-gray-100/80 rounded-2xl p-5 shadow-soft flex items-center gap-4">
          <div className="p-3.5 bg-rose-50 text-rose-600 rounded-xl">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Failed Attempts</p>
            <h3 className="text-xl font-extrabold text-gray-800 mt-0.5">
              {failedTxns.length} Failed
            </h3>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 w-full md:w-[280px] shadow-soft">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by student or TXN ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="p-4 sm:p-5">Transaction ID</th>
                <th className="p-4 sm:p-5">Student Info</th>
                <th className="p-4 sm:p-5">Amount</th>
                <th className="p-4 sm:p-5">Date</th>
                <th className="p-4 sm:p-5">Method</th>
                <th className="p-4 sm:p-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400 font-medium">
                    No transaction entries found.
                  </td>
                </tr>
              ) : (
                filteredTxns.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-4 sm:p-5 font-bold text-gray-800">{t.id}</td>
                    <td className="p-4 sm:p-5">
                      <div>
                        <p className="font-bold text-gray-800">{t.student}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{t.email}</p>
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 font-bold text-gray-800">₹{t.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                    <td className="p-4 sm:p-5 text-gray-450">{t.date}</td>
                    <td className="p-4 sm:p-5 text-gray-400">{t.method}</td>
                    <td className="p-4 sm:p-5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${getStatusStyle(
                          t.status
                        )}`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
