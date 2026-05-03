import Stripe from 'stripe';
import config from '../../config';
import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TCreateCheckoutSession } from './payment.interface';

const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: '2025-01-27.acacia' as any,
});

const createCheckoutSession = async (userId: string, payload: TCreateCheckoutSession) => {
  const { subscriptionPlan } = payload;

  if (!subscriptionPlan) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Please provide a Subscription Plan');
  }

  // ১. সাবস্ক্রিপশন প্ল্যান অনুযায়ী প্রাইস সেট (Cents এ)
  const planPrices: Record<string, number> = {
    'PREMIUM': 999, // $9.99
    'FAMILY': 1999  // $19.99
  };

  const amount = planPrices[subscriptionPlan];
  if (!amount) throw new AppError(httpStatus.BAD_REQUEST, 'Invalid Subscription Plan');

  const user = await prisma.user.findUnique({ where: { id: userId } });

  // ২. স্ট্রাইপ সেশন তৈরি
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${subscriptionPlan} Membership`,
          description: "Monthly Global Access to all content"
        },
        unit_amount: amount,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url: `${config.CLIENT_URL || 'http://localhost:3000'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${config.CLIENT_URL || 'http://localhost:3000'}/payment-cancel`,
    customer_email: user?.email,
    metadata: {
      userId,
      subscriptionPlan
    },
  });

  // ৩. ডাটাবেসে পেমেন্ট রেকর্ড তৈরি
  await prisma.payment.create({
    data: {
      amount,
      userId,
      sessionId: session.id,
      subscriptionId: subscriptionPlan, // আপনার স্কিমা অনুযায়ী
      status: 'PENDING',
    },
  });

  return { checkoutUrl: session.url };
};
const handleWebhook = async (sig: string, body: Buffer) => {
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      config.stripe_webhook_secret as string,
    );
  } catch (err: any) {
    console.error("❌ Webhook Signature Error:", err.message);
    throw new AppError(httpStatus.BAD_REQUEST, `Webhook Error: ${err.message}`);
  }

  console.log(`🔔 Received Webhook Event: ${event.type}`);

  // ✅ প্রধানত checkout.session.completed ইভেন্টটি হ্যান্ডেল করছি
  // কারণ এখান থেকেই আমরা metadata (userId, plan) এবং sessionId একসাথে পাই
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const subscriptionPlan = session.metadata?.subscriptionPlan;

    console.log("🚀 Processing Checkout Completion...");
    console.log(`User: ${userId}, Plan: ${subscriptionPlan}, SessionID: ${session.id}`);

    if (!userId || !subscriptionPlan) {
      console.error("❌ Missing userId or subscriptionPlan in metadata. Fulfillment skipped.");
      return { received: true };
    }

    try {
      // ✅ Atomic Transaction: পেমেন্ট আপডেট এবং সাবস্ক্রিপশন অ্যাক্টিভেশন একসাথে হবে
      await prisma.$transaction(async (tx) => {
        console.log("Stripe Session Data:", {
          id: session.id,
          user: session.metadata?.userId,
          plan: session.metadata?.subscriptionPlan
        });
        // ১. পেমেন্ট রেকর্ড আপডেট (sessionId ধরে)
        // এখানে transactionId হিসেবে session.payment_intent সেভ করছি
        const updatedPayment = await tx.payment.updateMany({
          where: { sessionId: session.id },
          data: {
            status: 'SUCCESS', // আপনার এনাম অনুযায়ী
            transactionId: session.payment_intent as string,
          },
        });
        console.log("👉 Record found and updated:", updatedPayment.count);

        if (updatedPayment.count === 0) {
          console.warn("⚠️ No pending payment record found for this sessionId in DB.");
          // অনেক সময় আগে পেমেন্ট ক্রিয়েট না হলেও আমরা এখানে নতুন রেকর্ড ক্রিয়েট করতে পারি
        }

        // ২. ইউজারের সাবস্ক্রিপশন স্ট্যাটাস আপডেট
        await tx.user.update({
          where: { id: userId },
          data: {
            subscription: subscriptionPlan as any,
            planExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // ৩০ দিন মেয়াদ
          },
        });

        // ৩. পারচেজ (Purchase) হিস্টোরিতে এন্ট্রি যোগ করা
        await tx.purchase.create({
          data: {
            userId,
            type: 'SUBSCRIPTION',
            subscriptionPlan: subscriptionPlan as any,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });

        console.log(`✅ Success: User ${userId} is now on ${subscriptionPlan} plan.`);
      }, {
        timeout: 10000 // ট্রানজ্যাকশন টাইমআউট ১০ সেকেন্ড (সেফটির জন্য)
      });
    } catch (err: any) {
      console.error("❌ DB Transaction Error:", err.message);
      // এখানে এরর থ্রো করলে স্ট্রাইপ আবার ট্রাই (Retry) করবে, যা ভালো।
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, `Webhook DB Error: ${err.message}`);
    }
  }

  // পেমেন্ট ফেইল করলে আপনি চাইলে 'checkout.session.expired' বা 'payment_intent.payment_failed' হ্যান্ডেল করতে পারেন
  if (event.type === 'checkout.session.expired') {
    const session = event.data.object as Stripe.Checkout.Session;
    await prisma.payment.updateMany({
      where: { sessionId: session.id },
      data: { status: 'FAILED' }
    });
    console.log("❌ Session Expired: Payment status set to FAILED");
  }

  return { received: true };
};
export const PaymentService = {
  createCheckoutSession,
  handleWebhook,
};