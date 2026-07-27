import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendErrorAlert } from '@/lib/error-alerts';

const PLAN_PRICES: Record<string, { full: number; monthly: number }> = {
  starter: { full: 7999, monthly: 2667 },
  professional: { full: 12999, monthly: 3250 },
  premium: { full: 22999, monthly: 3834 },
};

// User-friendly error messages — never expose internals
const USER_ERRORS = {
  MISSING_PLAN: 'Please select a course plan to continue.',
  COURSE_NOT_FOUND: 'The selected course could not be found. Please refresh the page and try again.',
  CHECKOUT_INIT_FAILED: 'Unable to initialize checkout. Please try again in a few moments.',
  SERVER_ERROR: 'Something went wrong on our end. Our team has been notified and is working to resolve this. Please try again shortly.',
} as const;

export async function POST(request: NextRequest) {
  let customerEmail = '';
  let planId = '';
  let billing = 'full';

  try {
    const body = await request.json();
    planId = body.planId;
    billing = body.billing || 'full';
    customerEmail = body.email || '';

    if (!planId) {
      return NextResponse.json({ error: USER_ERRORS.MISSING_PLAN }, { status: 400 });
    }

    // Duplicate payment guard — prevent double charges within 24 hours
    if (customerEmail) {
      const dupeCheckUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const dupeCheckKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
      if (dupeCheckUrl && dupeCheckKey) {
        const dupeSupabase = createClient(dupeCheckUrl, dupeCheckKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const { data: recentPayment } = await dupeSupabase
          .from('payments')
          .select('id, date')
          .eq('email', customerEmail)
          .eq('status', 'success')
          .gte('created_at', twentyFourHoursAgo)
          .limit(1)
          .maybeSingle();

        if (recentPayment) {
          return NextResponse.json({
            error: 'You already have a successful payment recorded within the last 24 hours. If you need to make another purchase, please contact us on WhatsApp or try again after 24 hours.',
            duplicatePayment: true,
          }, { status: 409 });
        }
      }
    }

    let amountInRupees = 0;
    
    // Check if it's a hardcoded plan
    if (PLAN_PRICES[planId]) {
      const plan = PLAN_PRICES[planId];
      amountInRupees = billing === 'monthly' ? plan.monthly : plan.full;
    } else {
      // Fetch from Supabase courses table
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
      
      if (!url || !key) {
        console.error('[Create Order] Supabase configuration missing');
        await sendErrorAlert({
          errorType: 'order-creation',
          errorMessage: 'Supabase URL or Service Role Key is not configured in environment variables.',
          customerEmail,
          planId,
          billing,
        });
        return NextResponse.json({ error: USER_ERRORS.SERVER_ERROR }, { status: 500 });
      }
      
      const adminSupabase = createClient(url, key, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
      
      const { data: course, error } = await adminSupabase
        .from('courses')
        .select('*')
        .eq('id', planId)
        .maybeSingle();
        
      if (error) {
        console.error('[Create Order] Database query error:', error.message);
        await sendErrorAlert({
          errorType: 'order-creation',
          errorMessage: `Database query failed: ${error.message}`,
          customerEmail,
          planId,
          billing,
        });
        return NextResponse.json({ error: USER_ERRORS.COURSE_NOT_FOUND }, { status: 400 });
      }

      if (!course) {
        return NextResponse.json({ error: USER_ERRORS.COURSE_NOT_FOUND }, { status: 400 });
      }
      
      const price = Number(course.price || 0);
      if (billing === 'monthly') {
        const durationStr = course.duration || '3 Months';
        let divisor = 3;
        if (durationStr.includes('3')) divisor = 3;
        else if (durationStr.includes('4')) divisor = 4;
        else if (durationStr.includes('5')) divisor = 5;
        else if (durationStr.includes('6')) divisor = 6;
        else if (durationStr.toLowerCase().includes('week')) divisor = 1;
        amountInRupees = Math.ceil(price / divisor);
      } else {
        amountInRupees = price;
      }
    }

    const amountInPaise = amountInRupees * 100;

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      console.error('[Create Order] Razorpay credentials missing');
      await sendErrorAlert({
        errorType: 'order-creation',
        errorMessage: 'Razorpay Key ID or Key Secret is not configured in environment variables.',
        customerEmail,
        planId,
        billing,
      });
      return NextResponse.json({ error: USER_ERRORS.SERVER_ERROR }, { status: 500 });
    }

    // Call Razorpay Order REST API directly (compatible with Cloudflare Workers/Next Edge Runtime)
    const credentials = btoa(`${keyId}:${keySecret}`);
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `rcpt_${Date.now()}_${String(planId).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 15)}`.slice(0, 40),
        notes: {
          planId,
          billing,
          email: customerEmail
        }
      })
    });

    const data: any = await response.json();

    if (!response.ok) {
      console.error('[Create Order] Razorpay API error:', data);
      await sendErrorAlert({
        errorType: 'order-creation',
        errorMessage: `Razorpay order creation failed (HTTP ${response.status}): ${data.error?.description || JSON.stringify(data)}`,
        customerEmail,
        planId,
        billing,
        extra: `Amount: ₹${amountInRupees} | Razorpay HTTP Status: ${response.status}`,
      });
      return NextResponse.json({ error: USER_ERRORS.CHECKOUT_INIT_FAILED }, { status: 502 });
    }

    return NextResponse.json({
      orderId: data.id,
      amount: amountInPaise,
      keyId
    });

  } catch (err: any) {
    console.error('[Create Order] Unhandled error:', err);
    await sendErrorAlert({
      errorType: 'order-creation',
      errorMessage: err.message || String(err),
      customerEmail,
      planId,
      billing,
      extra: err.stack ? err.stack.split('\n').slice(0, 5).join('\n') : undefined,
    });
    return NextResponse.json({ error: USER_ERRORS.SERVER_ERROR }, { status: 500 });
  }
}
