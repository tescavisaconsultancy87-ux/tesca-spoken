import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAuthAndRole } from '@/lib/security';

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
        persistSession: false
      }
    });

    // Attempt to query the notifications table
    try {
      const { data, error } = await adminSupabase
        .from('notifications')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!error && data) {
        // Format time in a friendly way (e.g. "5 mins ago", "1 hour ago", "yesterday")
        const mapped = data.map((n: any) => {
          const diffMs = Date.now() - new Date(n.created_at).getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMins / 600);
          
          let friendlyTime = 'just now';
          if (diffMins > 0 && diffMins < 60) {
            friendlyTime = `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
          } else if (diffHours > 0 && diffHours < 24) {
            friendlyTime = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
          } else if (diffHours >= 24) {
            friendlyTime = `${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) > 1 ? 's' : ''} ago`;
          }

          return {
            id: n.id,
            text: n.text,
            time: friendlyTime,
            unread: n.unread
          };
        });
        return NextResponse.json(mapped);
      }
    } catch (dbErr) {
      // If table is missing, return empty or default list (handled by client fallback)
      console.warn('[Notifications GET API] Notifications table is not created in Supabase yet. Returning default mock notification states.');
    }

    return NextResponse.json([]);
  } catch (err: any) {
    console.error('[Notifications GET API] Error:', err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
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
        persistSession: false
      }
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
      console.warn('[Notifications POST API] Notifications table missing. Ignoring read status DB write.');
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[Notifications POST API] Error:', err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
