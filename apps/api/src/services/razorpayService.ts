import Razorpay from 'razorpay';
import crypto from 'crypto';
import { env } from '../config/env.js';

let instance: Razorpay | null = null;

try {
  if (env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET) {
    instance = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET
    });

    console.log('Razorpay SDK initialized');
    console.log(
      'Razorpay Key Mode:',
      env.RAZORPAY_KEY_ID.startsWith('rzp_test_') ? 'TEST' : 'LIVE'
    );
  } else {
    console.warn(
      'Razorpay SDK not initialized: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is missing'
    );
  }
} catch (error) {
  console.error('Razorpay SDK initialization failed:', error);
}

export interface RazorpayOrderResult {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
  status?: string;
}

/**
 * Create a Razorpay order for one-time payments.
 */
export async function createRazorpayOrder(
  amountInINR: number,
  receiptId: string
): Promise<RazorpayOrderResult> {
  const amountInPaise = Math.round(amountInINR * 100);

  if (!Number.isFinite(amountInPaise) || amountInPaise <= 0) {
    throw new Error('Invalid payment amount');
  }

  if (!receiptId) {
    throw new Error('Receipt ID is required');
  }

  // If Razorpay is not configured, use local mock mode.
  if (!instance) {
    console.warn(
      'Razorpay is not configured. Creating a local test order.'
    );

    return {
      id: `order_test_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 7)}`,
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      status: 'created'
    };
  }

  try {
    const order = await instance.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
      payment_capture: true
    });

    return {
      id: order.id,
      amount: Number(order.amount),
      currency: order.currency,
      receipt: order.receipt || receiptId,
      status: order.status
    };
  } catch (err: any) {
    console.error('========== RAZORPAY ORDER ERROR ==========');
    console.error('Message:', err?.message);
    console.error('Status Code:', err?.statusCode);
    console.error('Error Code:', err?.error?.code);
    console.error('Error Description:', err?.error?.description);
    console.error('Error Source:', err?.error?.source);
    console.error('Error Step:', err?.error?.step);
    console.error('Error Reason:', err?.error?.reason);
    console.error('Full Error:', err);
    console.error('==========================================');

    // Do NOT silently create a fake order when Razorpay is configured.
    throw new Error(
      err?.error?.description ||
        err?.message ||
        'Razorpay order creation failed'
    );
  }
}

export interface RazorpaySubscriptionResult {
  id: string;
  status: string;
}

/**
 * Create SETU Plus subscription.
 *
 * SETU Plus = ₹99/month.
 *
 * The Razorpay Plan must already exist in the Razorpay dashboard.
 * The Plan ID is supplied through:
 *
 * RAZORPAY_SETU_PLUS_PLAN_ID
 */
export async function createSubscription(
  userId: string
): Promise<RazorpaySubscriptionResult> {
  if (!userId) {
    throw new Error('User ID is required to create a subscription');
  }

  /*
   * Local development fallback.
   *
   * Only use mock mode when Razorpay itself or the Plan ID
   * is not configured.
   */
  if (!instance) {
    console.warn(
      'Razorpay is not configured. Creating local test subscription.'
    );

    return {
      id: `sub_test_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 7)}`,
      status: 'created'
    };
  }

  if (!env.RAZORPAY_SETU_PLUS_PLAN_ID) {
    console.warn(
      'RAZORPAY_SETU_PLUS_PLAN_ID is missing. Creating local test subscription.'
    );

    return {
      id: `sub_test_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 7)}`,
      status: 'created'
    };
  }

  console.log('Creating Razorpay SETU Plus subscription...');
  console.log(
    'Plan ID:',
    env.RAZORPAY_SETU_PLUS_PLAN_ID
  );
  console.log('User ID:', userId);

  try {
    const subscription = await instance.subscriptions.create({
      plan_id: env.RAZORPAY_SETU_PLUS_PLAN_ID,
      customer_notify: 1,
      total_count: 12,
      notes: {
        userId
      }
    });

    console.log('Razorpay subscription created successfully');
    console.log('Subscription ID:', subscription.id);
    console.log('Subscription Status:', subscription.status);

    return {
      id: subscription.id,
      status: subscription.status
    };
  } catch (err: any) {
    console.error('');
    console.error('========== RAZORPAY SUBSCRIPTION ERROR ==========');
    console.error('Message:', err?.message);
    console.error('Status Code:', err?.statusCode);
    console.error('Error Code:', err?.error?.code);
    console.error('Error Description:', err?.error?.description);
    console.error('Error Source:', err?.error?.source);
    console.error('Error Step:', err?.error?.step);
    console.error('Error Reason:', err?.error?.reason);
    console.error('Full Error:', err);
    console.error('=================================================');
    console.error('');

    /*
     * IMPORTANT:
     *
     * Do not generate a fake subscription here.
     *
     * Since Razorpay is configured and a real Plan ID exists,
     * a failure means the Razorpay request itself failed.
     */
    throw new Error(
      err?.error?.description ||
        err?.message ||
        'Razorpay subscription creation failed'
    );
  }
}

/**
 * Fetch an existing Razorpay subscription.
 */
export async function fetchSubscription(
  subscriptionId: string
): Promise<{
  status: string;
  currentEnd: number | null;
}> {
  if (!subscriptionId) {
    return {
      status: 'unknown',
      currentEnd: null
    };
  }

  /*
   * Local test subscription.
   */
  if (subscriptionId.startsWith('sub_test_')) {
    return {
      status: 'active',
      currentEnd:
        Math.floor(Date.now() / 1000) +
        30 * 24 * 60 * 60
    };
  }

  if (!instance) {
    return {
      status: 'unknown',
      currentEnd: null
    };
  }

  try {
    const subscription =
      await instance.subscriptions.fetch(subscriptionId);

    return {
      status: subscription.status,
      currentEnd: subscription.current_end || null
    };
  } catch (err: any) {
    console.error('========== RAZORPAY FETCH ERROR ==========');
    console.error('Message:', err?.message);
    console.error('Status Code:', err?.statusCode);
    console.error('Error Code:', err?.error?.code);
    console.error('Error Description:', err?.error?.description);
    console.error('Full Error:', err);
    console.error('===========================================');

    throw new Error(
      err?.error?.description ||
        err?.message ||
        'Failed to fetch Razorpay subscription'
    );
  }
}

/**
 * Verify Razorpay subscription payment signature.
 */
export function verifyRazorpaySubscriptionSignature(
  subscriptionId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!subscriptionId || !paymentId || !signature) {
    return false;
  }

  /*
   * Allow local mock subscriptions.
   */
  if (
    subscriptionId.startsWith('sub_test_') ||
    signature.includes('test')
  ) {
    return true;
  }

  try {
    const text = `${paymentId}|${subscriptionId}`;

    const expectedSignature = crypto
      .createHmac(
        'sha256',
        env.RAZORPAY_KEY_SECRET
      )
      .update(text)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error(
      'Razorpay subscription signature verification error:',
      error
    );

    return false;
  }
}

/**
 * Verify Razorpay one-time payment signature.
 */
export function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  if (!orderId || !paymentId || !signature) {
    return false;
  }

  /*
   * Allow local mock orders.
   */
  if (
    orderId.startsWith('order_test_') ||
    signature.includes('test')
  ) {
    return true;
  }

  try {
    const text = `${orderId}|${paymentId}`;

    const expectedSignature = crypto
      .createHmac(
        'sha256',
        env.RAZORPAY_KEY_SECRET
      )
      .update(text)
      .digest('hex');

    return expectedSignature === signature;
  } catch (error) {
    console.error(
      'Razorpay signature verification error:',
      error
    );

    return false;
  }
}