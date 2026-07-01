import { NextRequest, NextResponse } from 'next/server';

const PLAN_PRICES: Record<string, { full: number; monthly: number }> = {
  starter: { full: 7999, monthly: 2667 },
  professional: { full: 12999, monthly: 3250 },
  premium: { full: 22999, monthly: 3834 },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { planId, billing = 'full', email } = body;

    if (!planId || !PLAN_PRICES[planId]) {
      return NextResponse.json({ error: 'Invalid or missing plan selection.' }, { status: 400 });
    }

    const plan = PLAN_PRICES[planId];
    const amountInRupees = billing === 'monthly' ? plan.monthly : plan.full;
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
        receipt: `rcpt_${Date.now()}_${planId}`,
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
      return NextResponse.json({ error: data.error?.description || 'Failed to create order with Razorpay.' }, { status: response.status });
    }

    return NextResponse.json({
      orderId: data.id,
      amount: amountInPaise,
      keyId
    });

  } catch (err: any) {
    console.error('[Checkout Order API Error]:', err);
    return NextResponse.json({ error: err.message || 'An error occurred during order creation.' }, { status: 500 });
  }
}
