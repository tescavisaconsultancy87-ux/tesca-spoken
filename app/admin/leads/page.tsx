'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Phone,
  MessageSquare,
  Check,
  X,
  PhoneCall,
  CheckCircle,
  Pencil,
  Trash2,
  Loader2,
  Calendar,
  Clock,
  History,
  Plus,
  AlertCircle,
  Tag,
  ArrowRight,
  User,
} from 'lucide-react';
import { db } from '@/lib/db';
import { supabase, ensureSupabaseClient } from '@/lib/supabaseClient';
import { SaveToggle, ButtonStatus } from '@/components/ui/SaveToggle';
import toast from '@/lib/toast';
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

export interface LeadFollowUp {
  id: string;
  timestamp: string;
  status: LeadStatus;
  discussion: string;
  nextFollowUpDate?: string | null;
  adminEmail?: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  source?: string;
  status: LeadStatus;
  dateAdded: string;
  course?: string;
  nextFollowUpDate?: string | null;
  followUps?: LeadFollowUp[];
  statusReason?: string | null;
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

const CONVERSION_REASONS = [
  'Enrolled in Course & Paid Fees',
  'Attended Demo & Confirmed Batch',
  'Direct Admission (Walk-in / Online)',
  'Special Discount Offer Accepted',
  'Weekend Batch Joined',
];

const REJECTION_REASONS = [
  'Course Fees Too High / Budget Issue',
  'Joined Another Institute',
  'Batch Timing Conflict',
  'Not Interested / Inquired by Mistake',
  'Invalid / Unreachable Phone Number',
  'Location / Distance Issue',
];

function getLeadStatusMeta(status: LeadStatus) {
  return LEAD_STATUS_OPTIONS.find((option) => option.value === status) || LEAD_STATUS_OPTIONS[0];
}

function normalizeLeadStatus(status: string | null | undefined): LeadStatus {
  return LEAD_STATUS_OPTIONS.some((option) => option.value === status) ? (status as LeadStatus) : 'new';
}

function formatDisplayDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function getFutureDateISO(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

function getFollowUpDateStatus(dateStr: string | null | undefined) {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);

  if (isNaN(target.getTime())) return null;

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: `Overdue (${Math.abs(diffDays)}d ago)`,
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-200 font-bold animate-pulse',
      iconClass: 'text-rose-600',
    };
  } else if (diffDays === 0) {
    return {
      label: 'Due Today',
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold',
      iconClass: 'text-amber-600',
    };
  } else if (diffDays === 1) {
    return {
      label: 'Due Tomorrow',
      badgeClass: 'bg-blue-100 text-blue-900 border-blue-200 font-bold',
      iconClass: 'text-blue-600',
    };
  } else {
    return {
      label: `In ${diffDays} days`,
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-medium',
      iconClass: 'text-indigo-500',
    };
  }
}

function parseLeadNotes(notes: string) {
  let source = 'Website Inquiry';
  let cleanNotes = notes;
  let course = '';

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

  const courseMatch = notes.match(/Selected Course:\s*([^\n]+)/);
  if (courseMatch) {
    course = courseMatch[1].trim();
  }

  if (cleanNotes.includes('[Tracking Metadata]')) {
    cleanNotes = cleanNotes.split('[Tracking Metadata]')[0].trim();
  }

  if (cleanNotes.includes('<!-- LEAD_FOLLOWUP_DATA:')) {
    cleanNotes = cleanNotes.split('<!-- LEAD_FOLLOWUP_DATA:')[0].trim();
  }

  return { source, cleanNotes, course };
}

export default function AdminLeadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);
  const [statusError, setStatusError] = useState('');
  const [currentAdminEmail, setCurrentAdminEmail] = useState<string>('Admin');

  // Edit lead modal state
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [editValidationError, setEditValidationError] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<ButtonStatus>('idle');

  // Delete lead modal state
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Follow-Up Prompt Dialog state (for Followup and Processing)
  const [followUpModalLead, setFollowUpModalLead] = useState<{
    lead: Lead;
    targetStatus: 'followup' | 'processing';
    nextFollowUpDate: string;
    discussion: string;
  } | null>(null);
  const [followUpSubmitting, setFollowUpSubmitting] = useState(false);
  const [followUpError, setFollowUpError] = useState('');

  // Status Reason Dialog state (for Converted and Rejected)
  const [statusReasonModalLead, setStatusReasonModalLead] = useState<{
    lead: Lead;
    targetStatus: 'converted' | 'rejected';
    reason: string;
    selectedTag: string;
  } | null>(null);
  const [statusReasonSubmitting, setStatusReasonSubmitting] = useState(false);
  const [statusReasonError, setStatusReasonError] = useState('');

  // History Drawer / Modal state
  const [historyModalLead, setHistoryModalLead] = useState<Lead | null>(null);
  const [editingHistoryEntry, setEditingHistoryEntry] = useState<{
    leadId: string;
    entry: LeadFollowUp;
    isNew?: boolean;
  } | null>(null);
  const [historySubmitting, setHistorySubmitting] = useState(false);

  useEffect(() => {
    if (editingLead) {
      setSaveStatus('idle');
    }
  }, [editingLead]);

  useEffect(() => {
    async function getAdminUser() {
      try {
        await ensureSupabaseClient();
        if (supabase) {
          const {
            data: { session },
          } = await supabase.auth.getSession();
          if (session?.user?.email) {
            setCurrentAdminEmail(session.user.email);
          }
        }
      } catch (e) {
        console.error('Failed to get admin session email:', e);
      }
    }
    getAdminUser();
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const data = await db.getLeads();
        const mapped = data.map((l: any) => {
          const { source, cleanNotes, course } = parseLeadNotes(l.notes || '');
          return {
            id: l.id,
            name: l.name,
            phone: l.phone,
            email: l.email || '',
            notes: cleanNotes,
            source: source,
            status: normalizeLeadStatus(l.status),
            dateAdded: l.date_added,
            course: course,
            nextFollowUpDate: l.next_followup_date || null,
            followUps: Array.isArray(l.follow_ups) ? l.follow_ups : [],
            statusReason: l.status_reason || null,
          };
        });
        setLeads(mapped);
      } catch (err) {
        console.error('Failed to load leads:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
        const {
          data: { session },
        } = await supabase.auth.getSession();
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
          status: editingLead.status,
          next_followup_date: editingLead.nextFollowUpDate || null,
          status_reason: editingLead.statusReason || null,
          follow_ups: editingLead.followUps || [],
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update lead details.');
      }

      setLeads((prev) => prev.map((l) => (l.id === editingLead.id ? { ...editingLead } : l)));
      if (historyModalLead?.id === editingLead.id) {
        setHistoryModalLead({ ...editingLead });
      }

      setSaveStatus('success');
      toast.success('Lead details updated successfully', 'Lead Updated');
      setTimeout(() => {
        setSaveStatus('saved');
        setEditingLead(null);
      }, 1000);
    } catch (err: any) {
      setEditValidationError(err.message || 'An error occurred. Please try again.');
      toast.error(err.message || 'Failed to update lead details', 'Update Failed');
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
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (session?.access_token) {
          headers['Authorization'] = `Bearer ${session.access_token}`;
        }
      }

      const response = await fetch('/api/admin/leads', {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ id: deleteConfirmId }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete lead record.');
      }

      setLeads((prev) => prev.filter((l) => l.id !== deleteConfirmId));
      if (historyModalLead?.id === deleteConfirmId) {
        setHistoryModalLead(null);
      }
      setDeleteConfirmId(null);
      toast.success('Lead record deleted successfully', 'Lead Removed');
    } catch (err: any) {
      setDeleteError(err.message || 'An error occurred. Please try again.');
      toast.error(err.message || 'Failed to delete lead', 'Delete Failed');
    } finally {
      setIsDeleting(false);
    }
  };

  // Status button click handler
  const handleStatusButtonClick = (lead: Lead, targetStatus: LeadStatus) => {
    if (lead.status === targetStatus) return;

    if (targetStatus === 'followup' || targetStatus === 'processing') {
      setFollowUpError('');
      setFollowUpModalLead({
        lead,
        targetStatus,
        nextFollowUpDate: lead.nextFollowUpDate || getFutureDateISO(2),
        discussion: '',
      });
      return;
    }

    if (targetStatus === 'converted' || targetStatus === 'rejected') {
      setStatusReasonError('');
      setStatusReasonModalLead({
        lead,
        targetStatus,
        reason: '',
        selectedTag: '',
      });
      return;
    }

    // Direct status update for 'new' or 'contacted'
    handleDirectStatusChange(lead, targetStatus);
  };

  const handleDirectStatusChange = async (lead: Lead, newStatus: LeadStatus) => {
    const previousLeads = leads;
    setStatusError('');
    setUpdatingStatusId(lead.id);

    // If moving to 'new' or 'contacted', retain history but ask/clear active nextFollowUpDate
    const updatedLead: Lead = {
      ...lead,
      status: newStatus,
      nextFollowUpDate: null, // Clear active follow-up schedule
    };

    setLeads((prev) => prev.map((l) => (l.id === lead.id ? updatedLead : l)));

    const success = await db.updateLeadStatus(lead.id, newStatus, {
      next_followup_date: null,
      follow_ups: lead.followUps,
      status_reason: lead.statusReason,
    });

    if (!success) {
      setLeads(previousLeads);
      setStatusError('Could not update the lead status. Please try again.');
      toast.error('Could not update lead status', 'Update Failed');
    } else {
      const statusLabel = getLeadStatusMeta(newStatus).label;
      toast.info(`Lead status updated to "${statusLabel}" (Follow-up schedule cleared)`, 'Status Updated');
    }
    setUpdatingStatusId(null);
  };

  // Submit Follow-Up Modal
  const handleSaveFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpModalLead) return;

    if (!followUpModalLead.nextFollowUpDate) {
      setFollowUpError('Please select the date for the next follow-up call.');
      return;
    }

    if (!followUpModalLead.discussion.trim()) {
      setFollowUpError('Please enter what was discussed in the call.');
      return;
    }

    setFollowUpSubmitting(true);
    setFollowUpError('');

    const targetLead = followUpModalLead.lead;
    const now = new Date();
    const timestampFormatted = now.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newFollowUpEntry: LeadFollowUp = {
      id: `fu-${Date.now()}`,
      timestamp: timestampFormatted,
      status: followUpModalLead.targetStatus,
      discussion: followUpModalLead.discussion.trim(),
      nextFollowUpDate: followUpModalLead.nextFollowUpDate,
      adminEmail: currentAdminEmail,
    };

    const updatedFollowUps = [newFollowUpEntry, ...(targetLead.followUps || [])];

    const updatedLead: Lead = {
      ...targetLead,
      status: followUpModalLead.targetStatus,
      nextFollowUpDate: followUpModalLead.nextFollowUpDate,
      followUps: updatedFollowUps,
    };

    try {
      const success = await db.updateLeadStatus(targetLead.id, followUpModalLead.targetStatus, {
        next_followup_date: followUpModalLead.nextFollowUpDate,
        follow_ups: updatedFollowUps,
        status_reason: targetLead.statusReason,
      });

      if (!success) {
        throw new Error('Failed to save follow-up details to database.');
      }

      setLeads((prev) => prev.map((l) => (l.id === targetLead.id ? updatedLead : l)));
      if (historyModalLead?.id === targetLead.id) {
        setHistoryModalLead(updatedLead);
      }

      const statusMeta = getLeadStatusMeta(followUpModalLead.targetStatus);
      toast.success(
        `Call logged. Next follow-up set for ${formatDisplayDate(followUpModalLead.nextFollowUpDate)}.`,
        `Stage: ${statusMeta.label}`
      );
      setFollowUpModalLead(null);
    } catch (err: any) {
      setFollowUpError(err.message || 'Failed to save follow-up.');
      toast.error(err.message || 'Failed to save follow-up.', 'Error');
    } finally {
      setFollowUpSubmitting(false);
    }
  };

  // Submit Status Reason Modal (Converted or Rejected)
  const handleSaveStatusReason = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusReasonModalLead) return;

    if (!statusReasonModalLead.reason.trim()) {
      setStatusReasonError('Please provide a reason before changing to this status.');
      return;
    }

    setStatusReasonSubmitting(true);
    setStatusReasonError('');

    const targetLead = statusReasonModalLead.lead;
    const now = new Date();
    const timestampFormatted = now.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const reasonLogEntry: LeadFollowUp = {
      id: `status-${Date.now()}`,
      timestamp: timestampFormatted,
      status: statusReasonModalLead.targetStatus,
      discussion: `[STATUS SET TO ${statusReasonModalLead.targetStatus.toUpperCase()}]: ${statusReasonModalLead.reason.trim()}`,
      nextFollowUpDate: null,
      adminEmail: currentAdminEmail,
    };

    const updatedFollowUps = [reasonLogEntry, ...(targetLead.followUps || [])];

    const updatedLead: Lead = {
      ...targetLead,
      status: statusReasonModalLead.targetStatus,
      statusReason: statusReasonModalLead.reason.trim(),
      nextFollowUpDate: null, // Always cleared upon conversion/rejection
      followUps: updatedFollowUps,
    };

    try {
      const success = await db.updateLeadStatus(targetLead.id, statusReasonModalLead.targetStatus, {
        next_followup_date: null,
        status_reason: statusReasonModalLead.reason.trim(),
        follow_ups: updatedFollowUps,
      });

      if (!success) {
        throw new Error('Failed to update lead status in database.');
      }

      setLeads((prev) => prev.map((l) => (l.id === targetLead.id ? updatedLead : l)));
      if (historyModalLead?.id === targetLead.id) {
        setHistoryModalLead(updatedLead);
      }

      const statusMeta = getLeadStatusMeta(statusReasonModalLead.targetStatus);
      toast.success(
        `Lead marked as ${statusMeta.label}. Next follow-up cleared.`,
        'Status Updated'
      );
      setStatusReasonModalLead(null);
    } catch (err: any) {
      setStatusReasonError(err.message || 'Failed to update status.');
      toast.error(err.message || 'Failed to update status.', 'Error');
    } finally {
      setStatusReasonSubmitting(false);
    }
  };

  // History Entry Edit/Delete Handlers
  const handleSaveHistoryEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHistoryEntry || !historyModalLead) return;

    setHistorySubmitting(true);
    const { leadId, entry, isNew } = editingHistoryEntry;

    let updatedFollowUps = [...(historyModalLead.followUps || [])];

    if (isNew) {
      updatedFollowUps = [entry, ...updatedFollowUps];
    } else {
      updatedFollowUps = updatedFollowUps.map((item) => (item.id === entry.id ? entry : item));
    }

    // Determine the newest scheduled follow-up date among existing entries if active
    let activeNextDate = historyModalLead.nextFollowUpDate;
    if (entry.nextFollowUpDate && (historyModalLead.status === 'followup' || historyModalLead.status === 'processing')) {
      activeNextDate = entry.nextFollowUpDate;
    }

    const updatedLead: Lead = {
      ...historyModalLead,
      nextFollowUpDate: activeNextDate,
      followUps: updatedFollowUps,
    };

    try {
      const success = await db.updateLeadStatus(leadId, historyModalLead.status, {
        next_followup_date: activeNextDate,
        follow_ups: updatedFollowUps,
        status_reason: historyModalLead.statusReason,
      });

      if (!success) throw new Error('Failed to update call history.');

      setLeads((prev) => prev.map((l) => (l.id === leadId ? updatedLead : l)));
      setHistoryModalLead(updatedLead);
      setEditingHistoryEntry(null);
      toast.success('Call log updated successfully.', 'History Updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update history.', 'Error');
    } finally {
      setHistorySubmitting(false);
    }
  };

  const handleDeleteHistoryEntry = async (entryId: string) => {
    if (!historyModalLead) return;
    const confirmDelete = window.confirm('Are you sure you want to delete this call discussion entry?');
    if (!confirmDelete) return;

    const updatedFollowUps = (historyModalLead.followUps || []).filter((item) => item.id !== entryId);

    const updatedLead: Lead = {
      ...historyModalLead,
      followUps: updatedFollowUps,
    };

    try {
      const success = await db.updateLeadStatus(historyModalLead.id, historyModalLead.status, {
        next_followup_date: historyModalLead.nextFollowUpDate,
        follow_ups: updatedFollowUps,
        status_reason: historyModalLead.statusReason,
      });

      if (!success) throw new Error('Failed to remove call log.');

      setLeads((prev) => prev.map((l) => (l.id === historyModalLead.id ? updatedLead : l)));
      setHistoryModalLead(updatedLead);
      toast.success('Call discussion entry removed.', 'Deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to remove call log.', 'Error');
    }
  };

  const handleDeleteFollowUpFromModal = async (entryId: string) => {
    if (!followUpModalLead) return;
    const confirmDelete = window.confirm('Are you sure you want to delete this call discussion entry?');
    if (!confirmDelete) return;

    const targetLead = followUpModalLead.lead;
    const updatedFollowUps = (targetLead.followUps || []).filter((item) => item.id !== entryId);

    const updatedLead: Lead = {
      ...targetLead,
      followUps: updatedFollowUps,
    };

    try {
      const success = await db.updateLeadStatus(targetLead.id, targetLead.status, {
        next_followup_date: targetLead.nextFollowUpDate,
        follow_ups: updatedFollowUps,
        status_reason: targetLead.statusReason,
      });

      if (!success) throw new Error('Failed to delete call log.');

      setLeads((prev) => prev.map((l) => (l.id === targetLead.id ? updatedLead : l)));
      setFollowUpModalLead({
        ...followUpModalLead,
        lead: updatedLead,
      });
      if (historyModalLead?.id === targetLead.id) {
        setHistoryModalLead(updatedLead);
      }
      toast.success('Call log deleted successfully.', 'Deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete call log.', 'Error');
    }
  };

  const handleClearStatusReason = async (lead: Lead) => {
    const confirmClear = window.confirm('Clear the status reason for this lead?');
    if (!confirmClear) return;

    const updatedLead: Lead = {
      ...lead,
      statusReason: null,
    };

    try {
      const success = await db.updateLeadStatus(lead.id, lead.status, {
        next_followup_date: lead.nextFollowUpDate,
        follow_ups: lead.followUps,
        status_reason: null,
      });

      if (!success) throw new Error('Failed to clear status reason.');

      setLeads((prev) => prev.map((l) => (l.id === lead.id ? updatedLead : l)));
      if (historyModalLead?.id === lead.id) {
        setHistoryModalLead(updatedLead);
      }
      toast.success('Status reason cleared.', 'Cleared');
    } catch (err: any) {
      toast.error(err.message || 'Failed to clear status reason.', 'Error');
    }
  };

  const handleClearNextFollowUp = async (lead: Lead) => {
    const confirmClear = window.confirm('Clear the scheduled next follow-up date for this lead? (Past call discussions will be preserved)');
    if (!confirmClear) return;

    const updatedLead: Lead = {
      ...lead,
      nextFollowUpDate: null,
    };

    try {
      const success = await db.updateLeadStatus(lead.id, lead.status, {
        next_followup_date: null,
        follow_ups: lead.followUps,
        status_reason: lead.statusReason,
      });

      if (!success) throw new Error('Failed to clear follow-up date.');

      setLeads((prev) => prev.map((l) => (l.id === lead.id ? updatedLead : l)));
      if (historyModalLead?.id === lead.id) {
        setHistoryModalLead(updatedLead);
      }
      toast.success('Scheduled follow-up date cleared.', 'Cleared');
    } catch (err: any) {
      toast.error(err.message || 'Failed to clear follow-up date.', 'Error');
    }
  };

  const normalizedSearchQuery = searchQuery.toLowerCase();
  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(normalizedSearchQuery) ||
      l.phone.toLowerCase().includes(normalizedSearchQuery) ||
      l.email.toLowerCase().includes(normalizedSearchQuery) ||
      l.notes.toLowerCase().includes(normalizedSearchQuery) ||
      (l.course || '').toLowerCase().includes(normalizedSearchQuery) ||
      (l.source || '').toLowerCase().includes(normalizedSearchQuery) ||
      (l.statusReason || '').toLowerCase().includes(normalizedSearchQuery) ||
      (l.nextFollowUpDate || '').toLowerCase().includes(normalizedSearchQuery) ||
      (l.followUps || []).some((fu) => fu.discussion.toLowerCase().includes(normalizedSearchQuery)) ||
      getLeadStatusMeta(l.status).label.toLowerCase().includes(normalizedSearchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Leads & Inquiries</h1>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">
          Follow up on call inquiries, demo test takers, and level evaluation submissions
        </p>
      </div>

      {statusError && (
        <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-600">
          {statusError}
        </div>
      )}

      {/* Filter toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 w-full md:w-[320px] shadow-soft">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads, discussions, dates, status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>

        <div className="text-xs text-gray-400 font-semibold">
          Showing <span className="font-extrabold text-gray-700">{filteredLeads.length}</span> lead{filteredLeads.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white border rounded-2xl p-5 shadow-soft animate-pulse space-y-4">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              <div className="h-16 bg-gray-100 rounded"></div>
            </div>
          ))}
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-soft">
          <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-700">No leads found</h3>
          <p className="text-xs text-gray-400 mt-1">Try adjusting your search query or filters.</p>
        </div>
      ) : (
        /* Leads list cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLeads.map((lead, index) => {
            const statusMeta = getLeadStatusMeta(lead.status);
            const isUpdatingStatus = updatingStatusId === lead.id;
            const followUpStatus = getFollowUpDateStatus(lead.nextFollowUpDate);
            const followUpCount = lead.followUps?.length || 0;

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
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${statusMeta.badgeClass}`}
                      >
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

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-gray-500">
                    <p>
                      Phone: <span className="text-gray-700">{lead.phone}</span>
                    </p>
                    <p>
                      Email: <span className="text-gray-700">{lead.email || 'N/A'}</span>
                    </p>
                    {lead.course && (
                      <p className="sm:col-span-2">
                        Course: <span className="text-primary font-extrabold">{lead.course}</span>
                      </p>
                    )}
                  </div>

                  {/* Scheduled Next Follow-up Alert (if scheduled) */}
                  {lead.nextFollowUpDate && (
                    <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <Calendar className={`h-4 w-4 flex-shrink-0 ${followUpStatus?.iconClass || 'text-amber-600'}`} />
                        <div className="truncate">
                          <span className="text-[11px] font-bold text-amber-900">
                            Next Follow-up: <span className="font-extrabold">{formatDisplayDate(lead.nextFollowUpDate)}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {followUpStatus && (
                          <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider border ${followUpStatus.badgeClass}`}>
                            {followUpStatus.label}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleClearNextFollowUp(lead)}
                          title="Clear scheduled date"
                          className="p-0.5 text-gray-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Status Reason Banner (for Converted or Rejected) */}
                  {lead.statusReason && (lead.status === 'converted' || lead.status === 'rejected') && (
                    <div
                      className={`flex items-start justify-between gap-2 px-3 py-2 rounded-xl text-xs border ${
                        lead.status === 'converted'
                          ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                          : 'bg-rose-50 text-rose-900 border-rose-200'
                      }`}
                    >
                      <div className="flex items-start gap-2 min-w-0 flex-1">
                        <Tag className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <span className="font-extrabold text-[10px] uppercase tracking-wider block">
                            {lead.status === 'converted' ? 'Conversion Reason' : 'Rejection Reason'}:
                          </span>
                          <p className="font-medium text-xs mt-0.5 leading-snug">{lead.statusReason}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleClearStatusReason(lead)}
                        title="Clear status reason"
                        className="p-0.5 text-gray-400 hover:text-rose-600 rounded transition-colors cursor-pointer flex-shrink-0"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Initial Inquiry Notes Box */}
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                      <span className="uppercase tracking-wider px-2 py-0.5 bg-gray-200/50 rounded text-gray-600">
                        Source: {lead.source || 'Website Inquiry'}
                      </span>
                    </div>
                    <div className="flex gap-2 border-t border-gray-100/50 pt-1.5">
                      <MessageSquare className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-500 font-medium leading-normal whitespace-pre-wrap">{lead.notes}</p>
                    </div>
                  </div>

                  {/* Follow-Up History & Log Call Bar */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setHistoryModalLead(lead)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors cursor-pointer group"
                    >
                      <History className="h-3.5 w-3.5 text-primary group-hover:rotate-[-30deg] transition-transform" />
                      <span>
                        Call History{' '}
                        <span className="px-1.5 py-0.2 bg-primary/10 text-primary text-[10px] font-extrabold rounded-full">
                          {followUpCount}
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFollowUpModalLead({
                          lead,
                          targetStatus: lead.status === 'processing' ? 'processing' : 'followup',
                          nextFollowUpDate: lead.nextFollowUpDate || getFutureDateISO(2),
                          discussion: '',
                        })
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Log Call</span>
                    </button>
                  </div>
                </div>

                {/* Pipeline Stage Buttons */}
                <div className="pt-3 border-t border-gray-55 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-bold">
                  <span className="text-[10px] text-gray-450 uppercase tracking-wider">Pipeline Stage:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {LEAD_STATUS_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        disabled={isUpdatingStatus}
                        onClick={() => handleStatusButtonClick(lead, option.value)}
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
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. Follow-Up & Call Discussion Modal (for Followup/Processing) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {followUpModalLead && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 w-full max-w-lg shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-amber-500" />
                  Log Follow-up & Discussion
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Recording call details for <span className="font-extrabold text-gray-700">{followUpModalLead.lead.name}</span>
                </p>
              </div>
              <button
                onClick={() => setFollowUpModalLead(null)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-55 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {followUpError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold">
                {followUpError}
              </div>
            )}

            <form onSubmit={handleSaveFollowUp} className="space-y-4 pt-4">
              {/* Target Status Toggle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500">Pipeline Stage</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFollowUpModalLead({ ...followUpModalLead, targetStatus: 'followup' })}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      followUpModalLead.targetStatus === 'followup'
                        ? 'bg-amber-50 text-amber-700 border-amber-300 ring-2 ring-amber-200'
                        : 'bg-gray-55 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Follow-up
                  </button>
                  <button
                    type="button"
                    onClick={() => setFollowUpModalLead({ ...followUpModalLead, targetStatus: 'processing' })}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      followUpModalLead.targetStatus === 'processing'
                        ? 'bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-200'
                        : 'bg-gray-55 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    Processing
                  </button>
                </div>
              </div>

              {/* Date of Next Follow-up with Presets */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-amber-600" />
                    Date of Next Follow-up <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-gray-400 font-semibold">When should we call back?</span>
                </div>

                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={followUpModalLead.nextFollowUpDate}
                  onChange={(e) => setFollowUpModalLead({ ...followUpModalLead, nextFollowUpDate: e.target.value })}
                  className="w-full bg-gray-55 border border-gray-150 rounded-xl px-4 py-2.5 text-xs text-gray-800 font-semibold focus:bg-white focus:border-amber-500 outline-none"
                  required
                />

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-gray-400 font-semibold">Quick picks:</span>
                  {[
                    { label: '+1 Day (Tomorrow)', days: 1 },
                    { label: '+2 Days', days: 2 },
                    { label: '+3 Days', days: 3 },
                    { label: '+1 Week', days: 7 },
                  ].map((preset) => (
                    <button
                      key={preset.days}
                      type="button"
                      onClick={() =>
                        setFollowUpModalLead({
                          ...followUpModalLead,
                          nextFollowUpDate: getFutureDateISO(preset.days),
                        })
                      }
                      className="px-2 py-1 text-[10px] font-bold rounded-lg border border-amber-200 bg-amber-50/60 text-amber-800 hover:bg-amber-100 transition-colors cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* What was discussed in current call */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-amber-600" />
                  What was discussed in this call? <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={followUpModalLead.discussion}
                  onChange={(e) => setFollowUpModalLead({ ...followUpModalLead, discussion: e.target.value })}
                  placeholder="e.g. Candidate answered. Discussed intermediate spoken course fees and evening batch timings. They will discuss with parents and attend a demo on Friday."
                  rows={4}
                  className="w-full bg-gray-55 border border-gray-150 rounded-xl p-3.5 text-xs text-gray-800 focus:bg-white focus:border-amber-500 outline-none leading-relaxed"
                  required
                />
              </div>

              {/* Past Follow-Up Context (if any exist) */}
              {followUpModalLead.lead.followUps && followUpModalLead.lead.followUps.length > 0 && (
                <div className="bg-gray-50 border border-gray-150 rounded-xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      Previous Call History ({followUpModalLead.lead.followUps.length})
                    </span>
                    <span className="text-[10px] text-gray-400">Click trash to delete entry</span>
                  </div>
                  <div className="max-h-36 overflow-y-auto space-y-2 pr-1 text-xs">
                    {followUpModalLead.lead.followUps.map((item, idx) => (
                      <div
                        key={item.id || idx}
                        className="flex items-start justify-between border-l-2 border-amber-400 pl-2.5 py-1.5 bg-white rounded-r-xl border-r border-t border-b border-gray-100 shadow-2xs group transition-all"
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <span className="text-[10px] text-gray-400 font-semibold block">{item.timestamp}:</span>
                          <p className="text-[11px] text-gray-700 leading-snug whitespace-pre-wrap mt-0.5">{item.discussion}</p>
                          {item.nextFollowUpDate && (
                            <p className="text-[10px] text-amber-700 font-bold mt-1 flex items-center gap-1">
                              <Calendar className="h-3 w-3" /> Next date: {formatDisplayDate(item.nextFollowUpDate)}
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteFollowUpFromModal(item.id)}
                          title="Delete this call log"
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setFollowUpModalLead(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-150 text-gray-500 text-xs font-bold hover:bg-gray-55 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={followUpSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-soft transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {followUpSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Saving Call Log...
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Save Follow-up & Set Stage
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. Status Reason Modal (for Converted / Completed & Rejected) */}
      {/* ───────────────────────────────────────────────────────────── */}
      {statusReasonModalLead && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <Tag
                    className={`h-4 w-4 ${
                      statusReasonModalLead.targetStatus === 'converted' ? 'text-emerald-600' : 'text-rose-600'
                    }`}
                  />
                  {statusReasonModalLead.targetStatus === 'converted' ? 'Mark as Converted (Completed)' : 'Mark as Rejected'}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Please provide the reason for <span className="font-extrabold text-gray-700">{statusReasonModalLead.lead.name}</span>
                </p>
              </div>
              <button
                onClick={() => setStatusReasonModalLead(null)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-55 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {statusReasonError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold">
                {statusReasonError}
              </div>
            )}

            <form onSubmit={handleSaveStatusReason} className="space-y-4 pt-4">
              {/* Quick Preset Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-600">Quick Reason Tags</label>
                <div className="flex flex-wrap gap-1.5">
                  {(statusReasonModalLead.targetStatus === 'converted' ? CONVERSION_REASONS : REJECTION_REASONS).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setStatusReasonModalLead({
                          ...statusReasonModalLead,
                          selectedTag: tag,
                          reason: statusReasonModalLead.reason ? `${tag} - ${statusReasonModalLead.reason}` : tag,
                        })
                      }
                      className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                        statusReasonModalLead.selectedTag === tag
                          ? statusReasonModalLead.targetStatus === 'converted'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-gray-55 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detailed Reason Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">
                  Reason & Final Notes <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={statusReasonModalLead.reason}
                  onChange={(e) => setStatusReasonModalLead({ ...statusReasonModalLead, reason: e.target.value })}
                  placeholder={
                    statusReasonModalLead.targetStatus === 'converted'
                      ? 'e.g. Enrolled in 3 Months Masterclass. Paid via UPI.'
                      : 'e.g. Student found timing unsuitable and joined morning offline classes elsewhere.'
                  }
                  rows={3}
                  className="w-full bg-gray-55 border border-gray-150 rounded-xl p-3 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                  required
                />
              </div>

              {/* Notice that upcoming follow-up date will be cleared */}
              <div className="p-3 bg-gray-50 border border-gray-150 rounded-xl text-[11px] text-gray-500 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>
                  Marking as <strong>{statusReasonModalLead.targetStatus === 'converted' ? 'Converted' : 'Rejected'}</strong> will
                  retire the lead and automatically clear any pending scheduled next follow-up dates.
                </span>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStatusReasonModalLead(null)}
                  className="px-4 py-2.5 rounded-xl border border-gray-150 text-gray-500 text-xs font-bold hover:bg-gray-55 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={statusReasonSubmitting}
                  className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold shadow-soft transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 ${
                    statusReasonModalLead.targetStatus === 'converted'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {statusReasonSubmitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Updating Status...
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Confirm & Update Status
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. Follow-Up History & Discussion Timeline Modal */}
      {/* ───────────────────────────────────────────────────────────── */}
      {historyModalLead && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 w-full max-w-2xl shadow-2xl animate-scale-up max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start pb-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                  <History className="h-4 w-4 text-primary" />
                  Follow-Up & Call History
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                  <span className="font-extrabold text-gray-800">{historyModalLead.name}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500">{historyModalLead.phone}</span>
                  <span className="text-gray-400">•</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                      getLeadStatusMeta(historyModalLead.status).badgeClass
                    }`}
                  >
                    {getLeadStatusMeta(historyModalLead.status).label}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setHistoryModalLead(null);
                  setEditingHistoryEntry(null);
                }}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-55 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sub-bar: Active Follow-up Schedule & Add New Call */}
            <div className="py-3 px-4 my-3 bg-gray-50 border border-gray-150 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="h-4 w-4 text-amber-600" />
                <div>
                  <span className="font-bold text-gray-700">Scheduled Follow-up: </span>
                  {historyModalLead.nextFollowUpDate ? (
                    <span className="font-extrabold text-amber-900 bg-amber-100/70 px-2 py-0.5 rounded">
                      {formatDisplayDate(historyModalLead.nextFollowUpDate)}
                    </span>
                  ) : (
                    <span className="text-gray-400 italic">None currently scheduled</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {historyModalLead.nextFollowUpDate && (
                  <button
                    type="button"
                    onClick={() => handleClearNextFollowUp(historyModalLead)}
                    className="text-[10px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg border border-rose-200 transition-colors cursor-pointer"
                  >
                    Clear Schedule
                  </button>
                )}
                <button
                  type="button"
                  onClick={() =>
                    setEditingHistoryEntry({
                      leadId: historyModalLead.id,
                      entry: {
                        id: `fu-${Date.now()}`,
                        timestamp: new Date().toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        }),
                        status: historyModalLead.status,
                        discussion: '',
                        nextFollowUpDate: historyModalLead.nextFollowUpDate || getFutureDateISO(2),
                        adminEmail: currentAdminEmail,
                      },
                      isNew: true,
                    })
                  }
                  className="text-[11px] font-bold text-white bg-primary hover:bg-primary/90 px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shadow-soft"
                >
                  <Plus className="h-3 w-3" />
                  Add Call Log
                </button>
              </div>
            </div>

            {/* Modal Body: Timeline or Inline Editor */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {editingHistoryEntry ? (
                /* Inline Editor for a call log */
                <form
                  onSubmit={handleSaveHistoryEntry}
                  className="bg-amber-50/40 border border-amber-200 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-amber-900">
                      {editingHistoryEntry.isNew ? 'Record New Call Discussion' : 'Edit Call Discussion'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingHistoryEntry(null)}
                      className="text-gray-400 hover:text-gray-600 p-0.5"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Call Timestamp</label>
                      <input
                        type="text"
                        value={editingHistoryEntry.entry.timestamp}
                        onChange={(e) =>
                          setEditingHistoryEntry({
                            ...editingHistoryEntry,
                            entry: { ...editingHistoryEntry.entry, timestamp: e.target.value },
                          })
                        }
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 outline-none mt-1"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase">Next Follow-up Date</label>
                      <input
                        type="date"
                        value={editingHistoryEntry.entry.nextFollowUpDate || ''}
                        onChange={(e) =>
                          setEditingHistoryEntry({
                            ...editingHistoryEntry,
                            entry: { ...editingHistoryEntry.entry, nextFollowUpDate: e.target.value || null },
                          })
                        }
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 outline-none mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase">Discussion Notes</label>
                    <textarea
                      value={editingHistoryEntry.entry.discussion}
                      onChange={(e) =>
                        setEditingHistoryEntry({
                          ...editingHistoryEntry,
                          entry: { ...editingHistoryEntry.entry, discussion: e.target.value },
                        })
                      }
                      rows={3}
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-gray-800 outline-none mt-1 leading-relaxed"
                      placeholder="What was discussed..."
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingHistoryEntry(null)}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={historySubmitting}
                      className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-soft flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      {historySubmitting && <Loader2 className="h-3 w-3 animate-spin" />}
                      Save Entry
                    </button>
                  </div>
                </form>
              ) : null}

              {/* Follow-up Timeline List */}
              {!historyModalLead.followUps || historyModalLead.followUps.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-xs font-semibold">No call discussions logged yet for this lead.</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Click &quot;Add Call Log&quot; above to log the first phone conversation.
                  </p>
                </div>
              ) : (
                <div className="relative border-l-2 border-gray-200 ml-4 space-y-6 pb-2">
                  {historyModalLead.followUps.map((fu, idx) => {
                    const callNumber = (historyModalLead.followUps?.length || 0) - idx;
                    const stageMeta = getLeadStatusMeta(fu.status);

                    return (
                      <div key={fu.id || idx} className="relative pl-6 group">
                        {/* Timeline node dot */}
                        <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-white border-2 border-primary flex items-center justify-center shadow-soft">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                        </div>

                        {/* Timeline card */}
                        <div className="bg-white border border-gray-150 rounded-2xl p-4 shadow-soft space-y-2 hover:border-gray-300 transition-colors">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-extrabold text-gray-800">
                                  {fu.discussion.startsWith('[STATUS') ? 'Status Change' : `Call / Follow-up #${callNumber}`}
                                </span>
                                <span
                                  className={`px-2 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider ${stageMeta.badgeClass}`}
                                >
                                  {stageMeta.label}
                                </span>
                              </div>
                              <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                                <Clock className="h-3 w-3 text-gray-400" />
                                {fu.timestamp} {fu.adminEmail ? `• by ${fu.adminEmail}` : ''}
                              </p>
                            </div>

                            {/* Actions on Entry */}
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingHistoryEntry({
                                    leadId: historyModalLead.id,
                                    entry: fu,
                                    isNew: false,
                                  })
                                }
                                title="Edit this entry"
                                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
                              >
                                <Pencil className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteHistoryEntry(fu.id)}
                                title="Delete this entry"
                                className="p-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>

                          {/* Discussion Notes */}
                          <div className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed bg-gray-55/70 rounded-xl p-3 border border-gray-100 font-medium">
                            {fu.discussion}
                          </div>

                          {/* Next Date recorded at that time */}
                          {fu.nextFollowUpDate && (
                            <div className="flex items-center gap-1.5 text-[11px] text-amber-800 font-semibold pt-0.5">
                              <Calendar className="h-3.5 w-3.5 text-amber-600" />
                              <span>Scheduled Next: {formatDisplayDate(fu.nextFollowUpDate)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setHistoryModalLead(null);
                  setEditingHistoryEntry(null);
                }}
                className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all cursor-pointer"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. Edit Lead Details Modal */}
      {/* ───────────────────────────────────────────────────────────── */}
      {(() => {
        const originalLead = editingLead ? leads.find((l) => l.id === editingLead.id) : null;
        const isEditUnchanged =
          originalLead && editingLead
            ? editingLead.name === originalLead.name &&
              editingLead.phone === originalLead.phone &&
              editingLead.email === (originalLead.email || '') &&
              editingLead.notes === (originalLead.notes || '') &&
              editingLead.status === originalLead.status &&
              (editingLead.nextFollowUpDate || '') === (originalLead.nextFollowUpDate || '') &&
              (editingLead.statusReason || '') === (originalLead.statusReason || '') &&
              (editingLead.source || '') === (originalLead.source || '')
            : false;

        return (
          editingLead && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white border border-gray-100 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 border-b border-gray-55">
                  <h3 className="text-base font-bold text-gray-800">Edit Lead Details</h3>
                  <button
                    onClick={() => {
                      setEditingLead(null);
                      setEditValidationError('');
                    }}
                    className="p-1 rounded-lg text-gray-400 hover:bg-gray-55 cursor-pointer"
                  >
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

                  {/* Next Follow-up Date */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-gray-500">Next Follow-Up Date</label>
                      {editingLead.nextFollowUpDate && (
                        <button
                          type="button"
                          onClick={() => setEditingLead({ ...editingLead, nextFollowUpDate: null })}
                          className="text-[10px] font-bold text-rose-600 hover:underline cursor-pointer"
                        >
                          Clear Date
                        </button>
                      )}
                    </div>
                    <input
                      type="date"
                      value={editingLead.nextFollowUpDate || ''}
                      onChange={(e) => setEditingLead({ ...editingLead, nextFollowUpDate: e.target.value || null })}
                      className="w-full bg-gray-55 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Lead Status</label>
                    <select
                      value={editingLead.status}
                      onChange={(e) =>
                        setEditingLead({
                          ...editingLead,
                          status: e.target.value as LeadStatus,
                          // If changing to converted/rejected, or non-followup, keep or clear date appropriately
                          nextFollowUpDate:
                            e.target.value === 'converted' || e.target.value === 'rejected'
                              ? null
                              : editingLead.nextFollowUpDate,
                        })
                      }
                      className="w-full bg-gray-55 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                    >
                      {LEAD_STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status Reason (if converted or rejected) */}
                  {(editingLead.status === 'converted' || editingLead.status === 'rejected' || editingLead.statusReason) && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">Status Reason</label>
                      <input
                        type="text"
                        value={editingLead.statusReason || ''}
                        onChange={(e) => setEditingLead({ ...editingLead, statusReason: e.target.value || null })}
                        placeholder="Reason for conversion / rejection..."
                        className="w-full bg-gray-55 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none"
                      />
                    </div>
                  )}

                  {/* Notes */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500">Inquiry Notes</label>
                    <textarea
                      value={editingLead.notes}
                      onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
                      className="w-full bg-gray-55 border border-gray-100 rounded-xl px-4 py-2.5 text-xs text-gray-800 focus:bg-white focus:border-primary outline-none min-h-[80px]"
                    />
                  </div>

                  <div className="flex gap-3 justify-end pt-4 border-t border-gray-55">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingLead(null);
                        setEditValidationError('');
                      }}
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
          )
        );
      })()}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. Delete Lead Alert Dialog */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AlertDialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteConfirmId(null);
            setDeleteError('');
          }
        }}
      >
        <AlertDialogPortal>
          <AlertDialogBackdrop className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" />
          <AlertDialogPopup from="bottom" className="sm:max-w-md border bg-white rounded-3xl p-6 shadow-2xl">
            <AlertDialogHeader>
              <div className="mx-auto h-12 w-12 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4 border border-rose-100 shadow-soft">
                <Trash2 className="h-6 w-6" />
              </div>
              <AlertDialogTitle className="text-lg font-bold text-center text-gray-800">
                Delete Lead Record?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-center text-gray-500 mt-2">
                Are you absolutely sure you want to delete this lead/inquiry record? This action will permanently remove it
                from the database and cannot be undone.
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
