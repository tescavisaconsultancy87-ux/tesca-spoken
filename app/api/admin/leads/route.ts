import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAuthAndRole, checkRateLimit, formatFriendlyError } from '@/lib/security';

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

function getAdminClient() {
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// 1. PATCH to update lead details
export async function PATCH(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 30, 60000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 });
    }

    const auth = await verifyAuthAndRole(request, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || 'Access denied.' }, { status: auth.status || 401 });
    }

    const body = await request.json();
    const { id, name, email, phone, notes, status, next_followup_date, follow_ups, status_reason } = body;

    if (!id) {
      return NextResponse.json({ error: 'Lead id is required.' }, { status: 400 });
    }

    const adminClient = getAdminClient();
    if (!adminClient) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Dev Sandbox] PATCH lead: ${id}`);
        return NextResponse.json({ success: true, dev: true });
      }
      return NextResponse.json({ error: 'Server configuration incomplete.' }, { status: 500 });
    }

    const updates: any = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (notes !== undefined) updates.notes = notes;
    if (status !== undefined) updates.status = status;
    if (next_followup_date !== undefined) updates.next_followup_date = next_followup_date;
    if (follow_ups !== undefined) updates.follow_ups = follow_ups;
    if (status_reason !== undefined) updates.status_reason = status_reason;

    let { data, error } = await adminClient
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    // Resilient fallback: If database columns don't exist yet, embed into notes
    if (error && (error.message?.includes('column') || error.code === '42703')) {
      console.warn('[Edit Lead] Missing columns detected. Falling back to embedded notes metadata:', error.message);
      const fallbackUpdates: any = { ...updates };
      delete fallbackUpdates.next_followup_date;
      delete fallbackUpdates.follow_ups;
      delete fallbackUpdates.status_reason;

      // Encode metadata inside notes
      const metadataPayload = {
        next_followup_date: next_followup_date ?? null,
        follow_ups: follow_ups ?? [],
        status_reason: status_reason ?? null,
      };

      let baseNotes = (notes !== undefined ? notes : '');
      if (baseNotes.includes('<!-- LEAD_FOLLOWUP_DATA:')) {
        baseNotes = baseNotes.split('<!-- LEAD_FOLLOWUP_DATA:')[0].trim();
      }
      fallbackUpdates.notes = `${baseNotes}\n\n<!-- LEAD_FOLLOWUP_DATA:${JSON.stringify(metadataPayload)} -->`;

      const fallbackResult = await adminClient
        .from('leads')
        .update(fallbackUpdates)
        .eq('id', id)
        .select()
        .single();

      data = fallbackResult.data;
      error = fallbackResult.error;
    }

    if (error) {
      console.error('[Edit Lead] DB update failed:', error.message);
      return NextResponse.json({ error: `Update failed: ${error.message}` }, { status: 400 });
    }

    console.log(`[Audit] Lead ${id} updated by admin ${auth.user?.email}`);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[Edit Lead] Error:', error);
    return NextResponse.json({ error: formatFriendlyError(error) }, { status: 500 });
  }
}

// 2. DELETE to remove lead record
export async function DELETE(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const rateCheck = checkRateLimit(ip, 30, 60000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 });
    }

    const auth = await verifyAuthAndRole(request, ['admin']);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || 'Access denied.' }, { status: auth.status || 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Lead id is required.' }, { status: 400 });
    }

    const adminClient = getAdminClient();
    if (!adminClient) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Dev Sandbox] DELETE lead: ${id}`);
        return NextResponse.json({ success: true, dev: true });
      }
      return NextResponse.json({ error: 'Server configuration incomplete.' }, { status: 500 });
    }

    const { error } = await adminClient
      .from('leads')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[Delete Lead] DB delete failed:', error.message);
      return NextResponse.json({ error: `Deletion failed: ${error.message}` }, { status: 400 });
    }

    console.log(`[Audit] Lead ${id} deleted by admin ${auth.user?.email}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Delete Lead] Error:', error);
    return NextResponse.json({ error: formatFriendlyError(error) }, { status: 500 });
  }
}
