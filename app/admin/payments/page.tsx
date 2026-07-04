'use client';

import { useState, useEffect } from 'react';
import { Search, Download, CreditCard, IndianRupee, ArrowUpRight, CheckCircle2, AlertCircle, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import { db } from '@/lib/db';
import { supabase, ensureSupabaseClient } from '@/lib/supabaseClient';
import { SaveToggle, ButtonStatus } from '@/components/ui/SaveToggle';
import {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogBackdrop,
  AlertDialogPopup,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogClose,
} from '@/components/animate-ui/primitives/base/alert-dialog';

interface Transaction {
  id: string;
  student: string;
  email: string;
  phone?: string;
  city?: string;
  amount: number;
  date: string;
  method: string;
  status: 'success' | 'failed' | 'refunded';
}

export default function AdminPaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit & Delete Payment states
  const [editingPayment, setEditingPayment] = useState<Transaction | null>(null);
  const [editValidationError, setEditValidationError] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<ButtonStatus>('idle');

  useEffect(() => {
    if (editingPayment) {
      setSaveStatus('idle');
    }
  }, [editingPayment]);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenEditModal = (txn: Transaction) => {
    setEditingPayment({ ...txn });
    setEditValidationError('');
  };

  const handleEditPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPayment) return;
    setEditValidationError('');
    setSaveStatus('loading');
    setEditSubmitting(true);

    try {
      await ensureSupabaseClient();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }
      }

      const response = await fetch('/api/admin/payments', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          id: editingPayment.id,
          student_name: editingPayment.student,
          email: editingPayment.email,
          amount: editingPayment.amount,
          date: editingPayment.date,
          method: editingPayment.method,
          status: editingPayment.status
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update payment record.');
      }

      // Update state locally
      setTransactions(transactions.map(t => t.id === editingPayment.id ? { ...editingPayment } : t));
      
      setSaveStatus('success');
      setTimeout(() => {
        setSaveStatus('saved');
        setEditingPayment(null);
      }, 1000);
    } catch (err: any) {
      setEditValidationError(err.message || 'An error occurred. Please try again.');
      setSaveStatus('idle');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeletePayment = async () => {
    if (!deleteConfirmId) return;
    setDeleteError('');
    setIsDeleting(true);

    try {
      await ensureSupabaseClient();
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }
      }

      const response = await fetch('/api/admin/payments', {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ id: deleteConfirmId })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete payment record.');
      }

      // Update state locally
      setTransactions(transactions.filter(t => t.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (err: any) {
      setDeleteError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    async function load() {
      const data = await db.getPayments();
      const mapped = data.map((t: any) => ({
        id: t.id,
        student: t.student_name,
        email: t.email,
        phone: t.phone,
        city: t.city,
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
                <th className="p-4 sm:p-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
              {filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-400 font-medium">
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
                        {(t.phone || t.city) && (
                          <p className="text-[10px] text-gray-400 mt-0.5 flex flex-wrap gap-1.5 items-center">
                            {t.phone && <span>📞 {t.phone}</span>}
                            {t.phone && t.city && <span className="text-gray-300">•</span>}
                            {t.city && <span>📍 {t.city}</span>}
                          </p>
                        )}
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
                    <td className="p-4 sm:p-5 text-right">
                      <div className="inline-flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(t)}
                          className="p-1.5 rounded-lg border border-gray-100 text-gray-650 hover:bg-gray-50 cursor-pointer"
                          title="Edit Payment"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(t.id)}
                          className="p-1.5 rounded-lg border border-gray-100 text-rose-600 hover:bg-rose-50 cursor-pointer"
                          title="Delete Payment"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Payment Modal */}
      {editingPayment && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center pb-4 border-b border-gray-50">
              <h3 className="text-base font-bold text-gray-800">Edit Payment Record</h3>
              <button onClick={() => { setEditingPayment(null); setEditValidationError(''); }} className="p-1 rounded-lg text-gray-400 hover:bg-gray-55 cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            {editValidationError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold">
                {editValidationError}
              </div>
            )}
            <form onSubmit={handleEditPayment} className="space-y-4 pt-4">
              {/* TXN ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Transaction ID</label>
                <div className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-500 font-bold select-all">
                  {editingPayment.id}
                </div>
              </div>

              {/* Student Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Student Name</label>
                <input
                  type="text"
                  value={editingPayment.student}
                  onChange={(e) => setEditingPayment({ ...editingPayment, student: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Email Address</label>
                <input
                  type="email"
                  value={editingPayment.email}
                  onChange={(e) => setEditingPayment({ ...editingPayment, email: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>

              {/* Amount */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Amount (INR)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingPayment.amount}
                  onChange={(e) => setEditingPayment({ ...editingPayment, amount: Number(e.target.value) })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Date</label>
                <input
                  type="text"
                  value={editingPayment.date}
                  onChange={(e) => setEditingPayment({ ...editingPayment, date: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>

              {/* Method */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Method</label>
                <input
                  type="text"
                  value={editingPayment.method}
                  onChange={(e) => setEditingPayment({ ...editingPayment, method: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Status</label>
                <select
                  value={editingPayment.status}
                  onChange={(e) => setEditingPayment({ ...editingPayment, status: e.target.value as any })}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                >
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-55">
                <button
                  type="button"
                  onClick={() => { setEditingPayment(null); setEditValidationError(''); }}
                  className="px-4 py-2.5 rounded-xl border border-gray-150 text-gray-500 text-xs font-bold hover:bg-gray-55 cursor-pointer"
                >
                  Cancel
                </button>
                <SaveToggle
                  type="submit"
                  status={saveStatus}
                  setStatus={setSaveStatus}
                  size="sm"
                  idleText="Save Changes"
                  savedText="Saved"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteConfirmId !== null} onOpenChange={(open) => { if (!open) { setDeleteConfirmId(null); setDeleteError(''); } }}>
        <AlertDialogPortal>
          <AlertDialogBackdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <AlertDialogPopup
            from="bottom"
            className="sm:max-w-md border bg-white rounded-3xl p-6 shadow-2xl"
          >
            <AlertDialogHeader>
              <div className="mx-auto h-12 w-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4 border border-rose-100 shadow-soft">
                <Trash2 className="h-6 w-6" />
              </div>
              <AlertDialogTitle className="text-lg font-bold text-center text-gray-800">
                Delete Payment Record?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-center text-gray-500 mt-2">
                Are you absolutely sure you want to delete this payment record ({deleteConfirmId})? This action will permanently remove it from the system and cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            {deleteError && (
              <div className="mt-4 rounded-xl bg-red-50 border border-red-100 p-3.5 text-xs font-semibold text-red-600 text-center">
                {deleteError}
              </div>
            )}

            <AlertDialogFooter className="mt-6 flex justify-end gap-3 w-full">
              <AlertDialogClose className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer border border-gray-200">
                Cancel
              </AlertDialogClose>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeletePayment}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-soft disabled:opacity-50"
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  'Delete Record'
                )}
              </button>
            </AlertDialogFooter>
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>
    </div>
  );
}
