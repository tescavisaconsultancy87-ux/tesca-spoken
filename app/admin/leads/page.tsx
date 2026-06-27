'use client';

import { useState, useEffect } from 'react';
import { Search, Phone, MessageSquare, Check, X, PhoneCall, CheckCircle } from 'lucide-react';
import { db } from '@/lib/db';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  notes: string;
  status: 'new' | 'contacted' | 'processing' | 'followup' | 'converted' | 'rejected';
  dateAdded: string;
}

export default function AdminLeadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await db.getLeads();
      const mapped = data.map((l: any) => ({
        id: l.id,
        name: l.name,
        phone: l.phone,
        email: l.email || '',
        notes: l.notes || '',
        status: l.status as any,
        dateAdded: l.date_added,
      }));
      setLeads(mapped);
      setLoading(false);
    }
    load();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'processing' | 'followup' | 'converted' | 'rejected') => {
    await db.updateLeadStatus(id, status);
    setLeads(leads.map((l) => (l.id === id ? { ...l, status } : l)));
  };

  const filteredLeads = leads.filter((l) =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.notes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Leads & Inquiries</h1>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">Follow up on call inquiries, demo test takers, and level evaluation submissions</p>
      </div>

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
        {filteredLeads.map((lead, index) => (
          <div
            key={lead.id || index}
            className={`bg-white border rounded-2xl p-5 shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between space-y-4 ${
              lead.status === 'processing'
                ? 'border-l-4 border-l-blue-500'
                : lead.status === 'followup'
                ? 'border-l-4 border-l-amber-500'
                : lead.status === 'converted'
                ? 'border-l-4 border-l-emerald-500'
                : lead.status === 'rejected'
                ? 'border-l-4 border-l-rose-500'
                : 'border-l-4 border-l-secondary'
            }`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-bold text-gray-800">{lead.name}</h3>
                  <p className="text-[10px] text-gray-400 mt-0.5">Registered: {lead.dateAdded}</p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                    lead.status === 'processing'
                      ? 'bg-blue-50 text-blue-600'
                      : lead.status === 'followup'
                      ? 'bg-amber-50 text-amber-600'
                      : lead.status === 'converted'
                      ? 'bg-emerald-50 text-emerald-600'
                      : lead.status === 'rejected'
                      ? 'bg-rose-50 text-rose-600'
                      : lead.status === 'contacted'
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'bg-gray-105 text-gray-500 border border-gray-200' // 'new'
                  }`}
                >
                  {lead.status}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold text-gray-500">
                <p>Phone: <span className="text-gray-700">{lead.phone}</span></p>
                <p>Email: <span className="text-gray-700">{lead.email}</span></p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex gap-2">
                <MessageSquare className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-500 font-medium leading-normal">{lead.notes}</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-3 border-t border-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-bold">
              <span className="text-[10px] text-gray-450 uppercase tracking-wider">Pipeline Stage:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => handleUpdateStatus(lead.id, 'processing')}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer uppercase tracking-wider ${
                    lead.status === 'processing'
                      ? 'bg-blue-50 text-blue-600 border-blue-200'
                      : 'bg-white border-gray-150 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Processing
                </button>
                <button
                  onClick={() => handleUpdateStatus(lead.id, 'followup')}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer uppercase tracking-wider ${
                    lead.status === 'followup'
                      ? 'bg-amber-50 text-amber-600 border-amber-200'
                      : 'bg-white border-gray-150 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Follow-up
                </button>
                <button
                  onClick={() => handleUpdateStatus(lead.id, 'converted')}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer uppercase tracking-wider ${
                    lead.status === 'converted'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                      : 'bg-white border-gray-150 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Converted
                </button>
                <button
                  onClick={() => handleUpdateStatus(lead.id, 'rejected')}
                  className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all cursor-pointer uppercase tracking-wider ${
                    lead.status === 'rejected'
                      ? 'bg-rose-50 text-rose-600 border-rose-200'
                      : 'bg-white border-gray-150 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Rejected
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
