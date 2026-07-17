'use client';

import { useState, useEffect } from 'react';
import { Search, Phone, MessageSquare, Check, X, PhoneCall, CheckCircle, Pencil, Trash2, Loader2 } from 'lucide-react';
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

type LeadStatus = 'new' | 'contacted' | 'processing' | 'followup' | 'converted' | 'rejected';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  source?: string;
  status: LeadStatus;
  dateAdded: string;
}

const LEAD_STATUS_OPTIONS: Array<{
  value: LeadStatus;
  label: string;
  borderClass: string;
  badgeClass: string;
  activeButtonClass: string;
}> = [
  {
    value: 'new',
    label: 'New',
    borderClass: 'border-l-4 border-l-secondary',
    badgeClass: 'bg-gray-105 text-gray-500 border border-gray-200',
    activeButtonClass: 'bg-gray-100 text-gray-600 border-gray-300',
  },
  {
    value: 'contacted',
    label: 'Contacted',
    borderClass: 'border-l-4 border-l-indigo-500',
    badgeClass: 'bg-indigo-50 text-indigo-600',
    activeButtonClass: 'bg-indigo-50 text-indigo-600 border-indigo-200',
  },
  {
    value: 'processing',
    label: 'Processing',
    borderClass: 'border-l-4 border-l-blue-500',
    badgeClass: 'bg-blue-50 text-blue-600',
    activeButtonClass: 'bg-blue-50 text-blue-600 border-blue-200',
  },
  {
    value: 'followup',
    label: 'Follow-up',
    borderClass: 'border-l-4 border-l-amber-500',
    badgeClass: 'bg-amber-50 text-amber-600',
    activeButtonClass: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  {
    value: 'converted',
    label: 'Converted',
    borderClass: 'border-l-4 border-l-emerald-500',
    badgeClass: 'bg-emerald-50 text-emerald-600',
    activeButtonClass: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  {
    value: 'rejected',
    label: 'Rejected',
    borderClass: 'border-l-4 border-l-rose-500',
    badgeClass: 'bg-rose-50 text-rose-600',
    activeButtonClass: 'bg-rose-50 text-rose-600 border-rose-200',
  },
];

function getLeadStatusMeta(status: LeadStatus) {
  return LEAD_STATUS_OPTIONS.find((option) => option.value === status) || LEAD_STATUS_OPTIONS[0];
}

function normalizeLeadStatus(status: string | null | undefined): LeadStatus {
  return LEAD_STATUS_OPTIONS.some((option) => option.value === status) ? status as LeadStatus : 'new';
}

function parseLeadNotes(notes: string) {
  let source = 'Website Inquiry';
  let cleanNotes = notes;

  if (notes.startsWith('Source: ')) {
    const lines = notes.split('\n');
    const sourceLine = lines[0];
    source = sourceLine.substring(8).trim();
    cleanNotes = lines.slice(1).join('\n');
  } else if (notes.includes('Requested Free Demo Class')) {
    source = 'Book Free Demo';
  } else if (notes.includes('Topic:') || notes.includes('Message:')) {
    source = 'Contact Us';
  } else if (notes.includes('CEFR Level:') || notes.includes('CEFR assessment')) {
    source = 'CEFR Assessment';
  }

  return { source, cleanNotes };
}

export default function AdminLeadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [statusError, setStatusError] = useState('');

  // Edit & Delete states
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [editValidationError, setEditValidationError] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<ButtonStatus>('idle');

  useEffect(() => {
    if (editingLead) {
      setSaveStatus('idle');
    }
  }, [editingLead]);

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenEditModal = (lead: Lead) => {
    setEditingLead({ ...lead });
    setEditValidationError('');
  };

  const handleEditLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;
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

      const response = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers,
        body: JSON.stringify({
          id: editingLead.id,
          name: editingLead.name,
          email: editingLead.email,
          phone: editingLead.phone,
          notes: editingLead.source ? `Source: ${editingLead.source}\n${editingLead.notes}` : editingLead.notes,
          status: editingLead.status
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update lead details.');
      }

      // Update state locally
      setLeads(leads.map(l => l.id === editingLead.id ? { ...editingLead } : l));
      
      setSaveStatus('success');
      setTimeout(() => {
        setSaveStatus('saved');
        setEditingLead(null);
      }, 1000);
    } catch (err: any) {
      setEditValidationError(err.message || 'An error occurred. Please try again.');
      setSaveStatus('idle');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeleteLead = async () => {
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

      const response = await fetch('/api/admin/leads', {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ id: deleteConfirmId })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete lead record.');
      }

      // Update state locally
      setLeads(leads.filter(l => l.id !== deleteConfirmId));
      setDeleteConfirmId(null);
    } catch (err: any) {
      setDeleteError(err.message || 'An error occurred. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    async function load() {
      const data = await db.getLeads();
      const mapped = data.map((l: any) => {
        const { source, cleanNotes } = parseLeadNotes(l.notes || '');
        return {
          id: l.id,
          name: l.name,
          phone: l.phone,
          email: l.email || '',
          notes: cleanNotes,
          source: source,
          status: normalizeLeadStatus(l.status),
          dateAdded: l.date_added,
        };
      });
      setLeads(mapped);
      setLoading(false);
    }
    load();
  }, []);

  const handleUpdateStatus = async (id: string, status: LeadStatus) => {
    const previousLeads = leads;
    setStatusError('');
    setUpdatingStatusId(id);
    setLeads(previousLeads.map((l) => (l.id === id ? { ...l, status } : l)));

    const updated = await db.updateLeadStatus(id, status);
    if (!updated) {
      setLeads(previousLeads);
      setStatusError('Could not update the lead status. Please try again.');
    }
    setUpdatingStatusId(null);
  };

  const normalizedSearchQuery = searchQuery.toLowerCase();
  const filteredLeads = leads.filter((l) =>
    l.name.toLowerCase().includes(normalizedSearchQuery) ||
    l.phone.toLowerCase().includes(normalizedSearchQuery) ||
    l.email.toLowerCase().includes(normalizedSearchQuery) ||
    l.notes.toLowerCase().includes(normalizedSearchQuery) ||
    (l.source || '').toLowerCase().includes(normalizedSearchQuery) ||
    getLeadStatusMeta(l.status).label.toLowerCase().includes(normalizedSearchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Leads & Inquiries</h1>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">Follow up on call inquiries, demo test takers, and level evaluation submissions</p>
      </div>

      {statusError && (
        <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">
          {statusError}
        </div>
      )}

      {/* Filter toolbar */}
      <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 w-full md:w-[280px] shadow-soft">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search leads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Leads list cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLeads.map((lead, index) => {
          const statusMeta = getLeadStatusMeta(lead.status);
          const isUpdatingStatus = updatingStatusId === lead.id;

          return (
          <div
            key={lead.id || index}
            className={`bg-white border rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between space-y-4 ${statusMeta.borderClass}`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">{lead.name}</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Registered: {lead.dateAdded}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${statusMeta.badgeClass}`}>
                    {statusMeta.label}
                  </span>
                  <button
                    onClick={() => handleOpenEditModal(lead)}
                    className="p-1 rounded-lg border border-gray-100 text-gray-650 hover:bg-gray-50 cursor-pointer animate-fade-in"
                    title="Edit Lead"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(lead.id)}
                    className="p-1 rounded-lg border border-gray-100 text-rose-600 hover:bg-rose-50 cursor-pointer animate-fade-in"
                    title="Delete Lead"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-gray-500">
                <p>Phone: <span className="text-gray-700">{lead.phone}</span></p>
                <p>Email: <span className="text-gray-700">{lead.email}</span></p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col gap-1.5">
                <div className="flex items-center text-[10px] font-bold text-gray-400">
                  <span className="uppercase tracking-wider px-2 py-0.5 bg-gray-200/50 rounded text-gray-600">
                    Source: {lead.source || 'Website Inquiry'}
                  </span>
                </div>
                <div className="flex gap-2 border-t border-gray-100/50 pt-1.5">
                  <MessageSquare className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-500 font-medium leading-normal whitespace-pre-wrap">{lead.notes}</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-3 border-t border-gray-55 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-bold">
              <span className="text-[10px] text-gray-450 uppercase tracking-wider">Pipeline Stage:</span>
              <div className="flex flex-wrap gap-1.5">
                {LEAD_STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus(lead.id, option.value)}
                    className={`min-w-[82px] px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer uppercase tracking-wider disabled:cursor-wait disabled:opacity-60 ${
                      lead.status === option.value
                        ? option.activeButtonClass
                        : 'bg-white border-gray-150 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {isUpdatingStatus && lead.status === option.value ? (
                      <span className="flex items-center justify-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        {option.label}
                      </span>
                    ) : (
                      option.label
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {/* Edit Lead Modal */}
      {(() => {
        const originalLead = editingLead ? leads.find(l => l.id === editingLead.id) : null;
        const isEditUnchanged = originalLead && editingLead ? (
          editingLead.name === originalLead.name &&
          editingLead.phone === originalLead.phone &&
          editingLead.email === (originalLead.email || '') &&
          editingLead.notes === (originalLead.notes || '') &&
          editingLead.status === originalLead.status &&
          (editingLead.source || '') === (originalLead.source || '')
        ) : false;

        return editingLead && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-scale-up">
              <div className="flex justify-between items-center pb-4 border-b border-gray-55">
                <h3 className="text-base font-bold text-gray-800">Edit Lead Details</h3>
                <button onClick={() => { setEditingLead(null); setEditValidationError(''); }} className="p-1 rounded-lg text-gray-400 hover:bg-gray-55 cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>
              {editValidationError && (
                <div className="mt-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold">
                  {editValidationError}
                </div>
              )}
              <form onSubmit={handleEditLead} className="space-y-4 pt-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Lead Name</label>
                  <input
                    type="text"
                    value={editingLead.name}
                    onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
                    className="w-full bg-gray-55 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                    required
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Phone Number</label>
                  <input
                    type="text"
                    value={editingLead.phone}
                    onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
                    className="w-full bg-gray-55 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Email Address</label>
                  <input
                    type="email"
                    value={editingLead.email}
                    onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
                    className="w-full bg-gray-55 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Inquiry Notes</label>
                  <textarea
                    value={editingLead.notes}
                    onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
                    className="w-full bg-gray-55 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none min-h-[80px]"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500">Lead Status</label>
                  <select
                    value={editingLead.status}
                    onChange={(e) => setEditingLead({ ...editingLead, status: e.target.value as LeadStatus })}
                    className="w-full bg-gray-55 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  >
                    {LEAD_STATUS_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 justify-end pt-4 border-t border-gray-55">
                  <button
                    type="button"
                    onClick={() => { setEditingLead(null); setEditValidationError(''); }}
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
                    disabled={isEditUnchanged}
                  />
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* Delete Lead Alert Dialog */}
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
                Delete Lead Record?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-center text-gray-500 mt-2">
                Are you absolutely sure you want to delete this lead/inquiry record? This action will permanently remove it from the database and cannot be undone.
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
                onClick={handleDeleteLead}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-soft disabled:opacity-50"
              >
                {isDeleting ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Deleting...
                  </span>
                ) : (
                  'Delete Lead'
                )}
              </button>
            </AlertDialogFooter>
          </AlertDialogPopup>
        </AlertDialogPortal>
      </AlertDialog>
    </div>
  );
}
