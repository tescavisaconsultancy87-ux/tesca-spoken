'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, Video, Clock, User, ArrowUpRight, Play, AlertCircle, Copy, Check, Key, Hash, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { db } from '@/lib/db';
import { useAuth } from '@/context/AuthContext';

interface LiveClass {
  id: string;
  topic: string;
  trainer: string;
  dateTime: string;
  duration: string;
  status: 'live' | 'upcoming' | 'completed';
  joinUrl?: string;
  platform?: string;
  meetingId?: string;
  meetingPassword?: string;
  batchId?: string;
}

interface Batch {
  id: string;
  name: string;
  time_period: string;
}

const PLATFORM_CONFIG: Record<string, { label: string; color: string; joinLabel: string }> = {
  google_meet: { label: 'Google Meet', color: 'bg-blue-50 text-blue-600 border-blue-100', joinLabel: 'Join Google Meet' },
  zoom: { label: 'Zoom', color: 'bg-indigo-50 text-indigo-600 border-indigo-100', joinLabel: 'Join Zoom Meeting' },
  teams: { label: 'MS Teams', color: 'bg-violet-50 text-violet-600 border-violet-100', joinLabel: 'Join Teams Meeting' },
  other: { label: 'Other', color: 'bg-gray-50 text-gray-600 border-gray-100', joinLabel: 'Join Meeting' },
};

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for HTTP
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all border hover:shadow-sm"
      style={{
        backgroundColor: copied ? '#ecfdf5' : '#f9fafb',
        borderColor: copied ? '#a7f3d0' : '#e5e7eb',
        color: copied ? '#059669' : '#6b7280',
      }}
      title={`Copy ${label}`}
    >
      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied!' : `Copy ${label}`}
    </button>
  );
}

export default function StudentLiveClassesPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'upcoming' | 'completed'>('upcoming');
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await db.getLiveClasses();
      const bData = await db.getBatches();
      setBatches(bData);

      // Find if student belongs to a batch
      const myBatch = bData.find((b: any) => {
        const studentIds = Array.isArray(b.student_ids)
          ? b.student_ids
          : typeof b.student_ids === 'string'
          ? JSON.parse(b.student_ids)
          : [];
        return studentIds.includes(user?.id);
      });
      const myBatchId = myBatch?.id;

      const mapped = data.map((lc: any) => {
        let formattedDateTime = lc.date_time;
        const parsedDate = new Date(lc.date_time);
        if (!isNaN(parsedDate.getTime())) {
          formattedDateTime = parsedDate.toLocaleDateString('en-IN', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        }

        return {
          id: lc.id,
          topic: lc.topic,
          trainer: lc.trainer,
          dateTime: formattedDateTime,
          duration: lc.duration,
          status: db.computeStatus(lc.date_time, lc.duration),
          joinUrl: lc.join_url,
          platform: lc.platform || 'google_meet',
          meetingId: lc.meeting_id,
          meetingPassword: lc.meeting_password,
          batchId: lc.batch_id,
        };
      });

      // Filter classes: show only if no batch is specified, or if it matches the student's batch ID
      const filtered = mapped.filter((lc: any) => !lc.batchId || lc.batchId === myBatchId);

      setLiveClasses(filtered);
      setLoading(false);
    }
    
    if (!authLoading) {
      if (user) {
        load();
      } else {
        setLoading(false);
      }
    }
  }, [user, authLoading]);

  const filteredClasses = liveClasses.filter((lc) => {
    if (activeFilter === 'upcoming') {
      return lc.status === 'live' || lc.status === 'upcoming';
    }
    return lc.status === 'completed';
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-800 tracking-tight">Live Classes</h1>
        <p className="text-xs text-gray-400 font-semibold mt-0.5">Attend daily interactive sessions and access recordings</p>
      </div>

      {/* Warning / Important Info banner */}
      <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4 flex gap-3 text-primary text-xs leading-normal">
        <AlertCircle className="h-5 w-5 flex-shrink-0" />
        <div className="space-y-1">
          <p className="font-bold">Live Class Guidelines:</p>
          <ul className="list-disc list-inside space-y-0.5 text-primary-600 font-medium">
            <li>Ensure a stable internet connection and quiet environment.</li>
            <li>Please join 5 minutes before the scheduled time.</li>
            <li>Keep your microphone muted unless prompted by the trainer.</li>
          </ul>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-gray-150 gap-6">
        <button
          onClick={() => setActiveFilter('upcoming')}
          className={`pb-4 text-sm font-bold border-b-2 transition-all relative ${
            activeFilter === 'upcoming'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Upcoming & Live Classes ({liveClasses.filter(c => c.status !== 'completed').length})
        </button>
        <button
          onClick={() => setActiveFilter('completed')}
          className={`pb-4 text-sm font-bold border-b-2 transition-all relative ${
            activeFilter === 'completed'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          Recorded Sessions ({liveClasses.filter(c => c.status === 'completed').length})
        </button>
      </div>

      {/* Content list */}
      <div className="space-y-4">
        {filteredClasses.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-soft">
            <Video className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-base font-bold text-gray-700">No classes found</h3>
            <p className="text-xs text-gray-400 mt-1">There are no sessions scheduled under this filter right now.</p>
          </div>
        ) : (
          filteredClasses.map((lc) => {
            const isLive = lc.status === 'live';
            const platformConf = PLATFORM_CONFIG[lc.platform || 'google_meet'] || PLATFORM_CONFIG.google_meet;
            const hasCredentials = !!(lc.meetingId || lc.meetingPassword);
            const batch = batches.find((b) => b.id === lc.batchId);

            return (
              <div
                key={lc.id}
                className={`bg-white border rounded-2xl shadow-soft transition-all duration-300 hover:shadow-soft-lg overflow-hidden ${
                  isLive ? 'border-secondary/30 ring-2 ring-secondary/5' : 'border-gray-100/80'
                }`}
              >
                {/* Main Row */}
                <div className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
                  {/* Topic and Trainer */}
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {isLive && (
                        <span className="inline-flex items-center gap-1 bg-secondary text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">
                          <span className="h-1.5 w-1.5 rounded-full bg-white" />
                          Live Now
                        </span>
                      )}
                      {/* Platform badge */}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-bold border ${platformConf.color}`}>
                        {platformConf.label}
                      </span>
                      {/* Batch badge */}
                      {batch && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-lg text-[9px] font-bold">
                          Batch: {batch.name} ({batch.time_period})
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                        <User className="h-3.5 w-3.5" />
                        {lc.trainer}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-800 tracking-tight leading-snug">
                      {lc.topic}
                    </h3>

                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-gray-400">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {lc.dateTime}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {lc.duration}
                      </span>
                    </div>
                  </div>

                  {/* Right Side: CTA buttons */}
                  <div className="w-full md:w-auto flex-shrink-0">
                    {isLive ? (
                      <a
                        href={lc.joinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-secondary text-white text-xs font-bold shadow-warm hover:bg-secondary-600 transition-all duration-300"
                      >
                        {platformConf.joinLabel}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    ) : lc.status === 'upcoming' ? (
                      lc.joinUrl ? (
                        <a
                          href={lc.joinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-bold shadow-soft transition-all duration-300"
                        >
                          {platformConf.joinLabel}
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </a>
                      ) : (
                        <button
                          disabled
                          className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 text-xs font-bold cursor-not-allowed"
                        >
                          Class Scheduled
                        </button>
                      )
                    ) : (
                      <span className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 text-xs font-bold">
                        <Play className="h-3.5 w-3.5" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>

                {/* Meeting Details Panel — shown when link or credentials exist */}
                {lc.joinUrl && (lc.status === 'live' || lc.status === 'upcoming') && (
                  <div className="border-t border-gray-50 bg-gray-50/40 px-5 py-3.5">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      {/* Meeting Link */}
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <LinkIcon className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                        <a
                          href={lc.joinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-primary hover:text-primary-600 truncate transition-colors"
                          title={lc.joinUrl}
                        >
                          {lc.joinUrl}
                          <ExternalLink className="h-3 w-3 ml-1 inline-block" />
                        </a>
                        <CopyButton text={lc.joinUrl} label="Link" />
                      </div>

                      {/* Meeting ID & Password */}
                      {hasCredentials && (
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {lc.meetingId && (
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500">
                                <Hash className="h-3 w-3" />
                                ID:
                              </span>
                              <span className="text-[11px] font-mono font-bold text-gray-700 bg-white border border-gray-100 rounded-lg px-2 py-0.5">{lc.meetingId}</span>
                              <CopyButton text={lc.meetingId} label="ID" />
                            </div>
                          )}
                          {lc.meetingPassword && (
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500">
                                <Key className="h-3 w-3" />
                                Pass:
                              </span>
                              <span className="text-[11px] font-mono font-bold text-gray-700 bg-white border border-gray-100 rounded-lg px-2 py-0.5">{lc.meetingPassword}</span>
                              <CopyButton text={lc.meetingPassword} label="Password" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
