import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { verifyAuthAndRole, checkRateLimit, formatFriendlyError } from '@/lib/security';

function getAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Handler to update payment details
async function handleUpdatePayment(request: NextRequest) {
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

    const body = await request.json().catch(() => ({}));
    const { id, student_name, email, amount, method, status, date } = body;

    if (!id) {
      return NextResponse.json({ error: 'Payment id is required.' }, { status: 400 });
    }

    const adminClient = getAdminClient();
    if (!adminClient) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Dev Sandbox] PATCH payment: ${id}`);
        return NextResponse.json({ success: true, dev: true });
      }
      return NextResponse.json({ error: 'Service is temporarily unavailable. Please try again.' }, { status: 500 });
    }

    const updates: any = {};
    if (student_name !== undefined) updates.student_name = student_name;
    if (email !== undefined) updates.email = email;
    if (amount !== undefined) updates.amount = Number(amount);
    if (method !== undefined) updates.method = method;
    if (status !== undefined) updates.status = status;
    if (date !== undefined) updates.date = date;

    const { data, error } = await adminClient
      .from('payments')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[Edit Payment] DB update failed:', error.message);
      return NextResponse.json({ error: formatFriendlyError(error) }, { status: 400 });
    }

    console.log(`[Audit] Payment ${id} updated by admin ${auth.user?.email}`);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('[Edit Payment] Error:', error);
    return NextResponse.json({ error: formatFriendlyError(error) }, { status: 500 });
  }
}

// Handler to remove payment records
async function handleDeletePayment(request: NextRequest, bodyOverride?: any) {
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

    const body = bodyOverride || (await request.json().catch(() => ({})));
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Payment id is required.' }, { status: 400 });
    }

    const adminClient = getAdminClient();
    if (!adminClient) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Dev Sandbox] DELETE payment: ${id}`);
        return NextResponse.json({ success: true, dev: true });
      }
      return NextResponse.json({ error: 'Service is temporarily unavailable. Please try again.' }, { status: 500 });
    }

    const { error } = await adminClient
      .from('payments')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('[Delete Payment] DB delete failed:', error.message);
      return NextResponse.json({ error: formatFriendlyError(error) }, { status: 400 });
    }

    console.log(`[Audit] Payment ${id} deleted by admin ${auth.user?.email}`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[Delete Payment] Error:', error);
    return NextResponse.json({ error: formatFriendlyError(error) }, { status: 500 });
  }
}

// 1. POST route (Supports both update and delete actions)
export async function POST(request: NextRequest) {
  try {
    const cloned = request.clone();
    const body = await cloned.json().catch(() => ({}));
    if (body.action === 'delete') {
      return handleDeletePayment(request, body);
    }
    return handleUpdatePayment(request);
  } catch {
    return handleUpdatePayment(request);
  }
}

// 2. PATCH route
export async function PATCH(request: NextRequest) {
  return handleUpdatePayment(request);
}

// 3. DELETE route
export async function DELETE(request: NextRequest) {
  return handleDeletePayment(request);
}
