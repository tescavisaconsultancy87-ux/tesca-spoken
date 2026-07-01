'use client';

import { useState, useEffect } from 'react';
import { Search, Video, Calendar, Clock, User } from 'lucide-react';
import { db } from '@/lib/db';

interface LiveClass {
  id: string;
  topic: string;
  trainer: string;
  date_time: string;
  duration: string;
  join_url?: string;
  status: string;
}

export default function AdminLiveClassesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all');

  const loadData = async () => {
    try {
      const data = await db.getLiveClasses();
      setLiveClasses(data);
    } catch (err) {
      console.error('Failed to load live classes', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = liveClasses.filter((lc) => {
    const status = db.computeStatus(lc.date_time, lc.duration);
    const matchesStatus = activeStatus === 'all' || status === activeStatus;
    const matchesQuery =
      lc.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lc.trainer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const statusColors: Record<string, string> = {
    live: 'bg-secondary text-white',
    upcoming: 'bg-primary-50 text-primary',
    completed: 'bg-gray-100 text-gray-500',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Live Classes</h1>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">View scheduled, running, and completed live sessions</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between border-b border-gray-50 pb-4">
        {/* Status Tabs */}
        <div className="flex border-b border-gray-100 gap-6 w-full sm:w-auto">
          {(['all', 'upcoming', 'live', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative border-b-2 ${
                activeStatus === status
                  ? 'text-primary border-primary font-extrabold'
                  : 'text-gray-400 border-transparent hover:text-gray-600'
              }`}
            >
              {status === 'all'
                ? 'All Classes'
                : status === 'upcoming'
                ? 'Scheduled'
                : status === 'live'
                ? 'Running (Live)'
                : 'Completed'}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-4 py-2.5 w-full sm:w-[280px] shadow-soft">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search classes or trainers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-gray-700 outline-none placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="py-12 text-center text-gray-400">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-2 text-xs font-semibold">Loading live classes...</p>
        </div>
      ) : (
        /* Classes Table */
        <div className="bg-white border border-gray-100 rounded-2xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  <th className="p-4 sm:p-5">Class</th>
                  <th className="p-4 sm:p-5">Schedule</th>
                  <th className="p-4 sm:p-5">Duration</th>
                  <th className="p-4 sm:p-5">Status</th>
                  <th className="p-4 sm:p-5 text-right">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-medium text-gray-700">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-400 font-medium">
                      <Video className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                      No live classes found for this category.
                    </td>
                  </tr>
                ) : (
                  filtered.map((lc) => {
                    const status = db.computeStatus(lc.date_time, lc.duration);
                    return (
                      <tr key={lc.id} className="hover:bg-gray-55/30 transition-colors">
                        <td className="p-4 sm:p-5">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-secondary-50 text-secondary flex items-center justify-center">
                              <Video className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-800">{lc.topic}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {lc.trainer}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 sm:p-5">
                          <span className="inline-flex items-center gap-1.5 text-gray-500">
                            <Calendar className="h-3.5 w-3.5" />
                            {(() => {
                              const parsedDate = new Date(lc.date_time);
                              if (isNaN(parsedDate.getTime())) {
                                return lc.date_time;
                              }
                              return parsedDate.toLocaleDateString('en-IN', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              });
                            })()}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5">
                          <span className="inline-flex items-center gap-1.5 text-gray-500">
                            <Clock className="h-3.5 w-3.5" />
                            {lc.duration}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              statusColors[status] || 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {status === 'live' && <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
                            {status === 'upcoming' ? 'scheduled' : status === 'live' ? 'running' : status}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 text-right">
                          {status === 'completed' ? (
                            <span className="text-[10px] text-gray-400 font-semibold uppercase">Ended</span>
                          ) : lc.join_url ? (
                            <a
                              href={lc.join_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center px-3.5 py-1.5 bg-primary hover:bg-primary-600 text-white rounded-lg text-[10px] font-bold transition-all shadow-soft"
                            >
                              Join Class
                            </a>
                          ) : (
                            <span className="text-[10px] text-gray-400 font-semibold uppercase">No Link</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
