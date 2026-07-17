import { NextRequest, NextResponse } from 'next/server';

import { createClient } from '@supabase/supabase-js';

const PLAN_PRICES: Record<string, { full: number; monthly: number }> = {
  starter: { full: 7999, monthly: 2667 },
  professional: { full: 12999, monthly: 3250 },
  premium: { full: 22999, monthly: 3834 },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, billing = 'full', email } = body;

    if (!planId) {
      return NextResponse.json({ error: 'Missing plan selection.' }, { status: 400 });
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
        return NextResponse.json({ error: 'Supabase configuration is missing on the server.' }, { status: 500 });
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
        
      if (error || !course) {
        return NextResponse.json({ error: 'Selected course not found.' }, { status: 400 });
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
      return NextResponse.json({ error: 'Razorpay configuration is missing on the server.' }, { status: 500 });
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
          email
        }
      })
    });

    const data: any = await response.json();

    if (!response.ok) {
      console.error('[Razorpay Order Creation Failed]:', data);
      const rawError = data.error?.description || '';
      let friendlyError = 'Failed to create order with the payment gateway.';
      if (rawError) {
        if (rawError.includes('receipt') || rawError.includes('key') || rawError.includes('auth')) {
          friendlyError = 'Unable to initialize checkout. Please contact support or try again later.';
        } else {
          friendlyError = rawError;
        }
      }
      return NextResponse.json({ error: friendlyError }, { status: response.status });
    }

    return NextResponse.json({
      orderId: data.id,
      amount: amountInPaise,
      keyId
    });

  } catch (err: any) {
    console.error('[Checkout Order API Error]:', err);
    return NextResponse.json({ error: 'An error occurred during order creation.' }, { status: 500 });
  }
}
