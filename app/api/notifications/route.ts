import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAuthAndRole } from '@/lib/security';

function getFriendlyTime(dateStr: string | null | undefined): string {
  if (!dateStr) return 'recently';
  const timeMs = new Date(dateStr).getTime();
  if (isNaN(timeMs)) return 'recently';

  const diffMs = Date.now() - timeMs;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuthAndRole(request, ['student', 'admin', 'tutor']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, role } = auth.user;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!url || !key) {
      return NextResponse.json([]);
    }

    const adminSupabase = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const realNotifications: Array<{ id: string; text: string; time: string; createdAt: string; unread: boolean }> = [];

    // 1. Direct Notifications Table Query (if created)
    try {
      const { data: directNotifs } = await adminSupabase
        .from('notifications')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (directNotifs && directNotifs.length > 0) {
        directNotifs.forEach((n: any) => {
          realNotifications.push({
            id: n.id,
            text: n.text || n.title || 'System Notification',
            time: getFriendlyTime(n.created_at),
            createdAt: n.created_at || new Date().toISOString(),
            unread: n.unread !== false,
          });
        });
      }
    } catch (_) {}

    // 2. Real System Activity Queries based on user role
    if (role === 'admin') {
      // Query recent leads
      try {
        const { data: leads } = await adminSupabase
          .from('leads')
          .select('id, name, course, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        if (leads && leads.length > 0) {
          leads.forEach((lead: any) => {
            const leadName = lead.name || 'New visitor';
            realNotifications.push({
              id: `lead-${lead.id}`,
              text: `${leadName} registered as a new lead.`,
              time: getFriendlyTime(lead.created_at),
              createdAt: lead.created_at || new Date().toISOString(),
              unread: true,
            });
          });
        }
      } catch (_) {}

      // Query recent payments
      try {
        const { data: payments } = await adminSupabase
          .from('payments')
          .select('id, amount, user_name, user_email, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        if (payments && payments.length > 0) {
          payments.forEach((pay: any) => {
            const payer = pay.user_name || pay.user_email || 'Student';
            const amt = pay.amount ? `₹${Number(pay.amount).toLocaleString('en-IN')}` : 'Payment';
            realNotifications.push({
              id: `pay-${pay.id}`,
              text: `${amt} received from ${payer}.`,
              time: getFriendlyTime(pay.created_at),
              createdAt: pay.created_at || new Date().toISOString(),
              unread: true,
            });
          });
        }
      } catch (_) {}

      // Query recent student profile signups
      try {
        const { data: students } = await adminSupabase
          .from('profiles')
          .select('id, name, email, created_at')
          .eq('role', 'student')
          .order('created_at', { ascending: false })
          .limit(5);

        if (students && students.length > 0) {
          students.forEach((st: any) => {
            const stName = st.name || st.email || 'Student';
            realNotifications.push({
              id: `st-${st.id}`,
              text: `New student ${stName} joined.`,
              time: getFriendlyTime(st.created_at),
              createdAt: st.created_at || new Date().toISOString(),
              unread: true,
            });
          });
        }
      } catch (_) {}
    } else {
      // For Student and Tutor: Query Live Classes and Study Materials
      try {
        const { data: liveClasses } = await adminSupabase
          .from('live_classes')
          .select('id, title, date_time, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        if (liveClasses && liveClasses.length > 0) {
          liveClasses.forEach((lc: any) => {
            realNotifications.push({
              id: `lc-${lc.id}`,
              text: `Live Class: "${lc.title || 'Session'}" scheduled.`,
              time: getFriendlyTime(lc.created_at || lc.date_time),
              createdAt: lc.created_at || lc.date_time || new Date().toISOString(),
              unread: true,
            });
          });
        }
      } catch (_) {}

      try {
        const { data: materials } = await adminSupabase
          .from('study_materials')
          .select('id, title, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        if (materials && materials.length > 0) {
          materials.forEach((mat: any) => {
            realNotifications.push({
              id: `mat-${mat.id}`,
              text: `Study material "${mat.title || 'Document'}" unlocked.`,
              time: getFriendlyTime(mat.created_at),
              createdAt: mat.created_at || new Date().toISOString(),
              unread: true,
            });
          });
        }
      } catch (_) {}
    }

    // Sort all gathered real notifications chronologically (newest first)
    realNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Deduplicate by ID
    const uniqueMap = new Map<string, typeof realNotifications[0]>();
    realNotifications.forEach((item) => {
      if (!uniqueMap.has(item.id)) {
        uniqueMap.set(item.id, item);
      }
    });

    const finalNotifications = Array.from(uniqueMap.values()).slice(0, 15);

    return NextResponse.json(finalNotifications);
  } catch (err: any) {
    console.error('[Notifications GET API] Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuthAndRole(request, ['student', 'admin', 'tutor']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId } = auth.user;
    const body = await request.json();
    const { notificationId, markAllRead } = body;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (!url || !key) {
      return NextResponse.json({ success: true });
    }

    const adminSupabase = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    try {
      if (markAllRead) {
        await adminSupabase
          .from('notifications')
          .update({ unread: false })
          .eq('user_id', userId);
      } else if (notificationId) {
        await adminSupabase
          .from('notifications')
          .update({ unread: false })
          .eq('id', notificationId)
          .eq('user_id', userId);
      }
    } catch (dbErr) {
      console.warn('[Notifications POST API] Read status write warning:', dbErr);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[Notifications POST API] Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAuthAndRole(request, ['student', 'admin', 'tutor']);
    if (!auth.authorized || !auth.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: userId } = auth.user;
    const body = await request.json();
    const { notificationId, clearAll } = body;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

    if (url && key) {
      const adminSupabase = createClient(url, key, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });

      try {
        if (clearAll) {
          await adminSupabase
            .from('notifications')
            .delete()
            .eq('user_id', userId);
        } else if (notificationId) {
          await adminSupabase
            .from('notifications')
            .delete()
            .eq('id', notificationId)
            .eq('user_id', userId);
        }
      } catch (dbErr) {
        console.warn('[Notifications DELETE API] Delete write warning:', dbErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[Notifications DELETE API] Error:', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

