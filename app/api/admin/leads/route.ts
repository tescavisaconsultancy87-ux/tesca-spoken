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
    const { id, name, email, phone, notes, status } = body;

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

    const { data, error } = await adminClient
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

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
