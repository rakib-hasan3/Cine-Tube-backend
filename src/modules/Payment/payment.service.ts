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
    throw new AppError(httpStatus.BAD_REQUEST, `Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, subscriptionPlan } = session.metadata as any;

    await prisma.$transaction(async (tx) => {
      // পেমেন্ট স্ট্যাটাস সাকসেস করা
      await tx.payment.update({
        where: { sessionId: session.id },
        data: { status: 'SUCCESS', transactionId: session.payment_intent as string },
      });

      const expiryDate = new Date();
      expiryDate.setMonth(expiryDate.getMonth() + 1);

      // ইউজার এবং পারচেজ টেবিল আপডেট
      if (subscriptionPlan) {
        await tx.user.update({
          where: { id: userId },
          data: {
            subscription: subscriptionPlan,
            planExpiresAt: expiryDate
          }
        });

        await tx.purchase.create({
          data: {
            userId,
            type: 'SUBSCRIPTION',
            expiresAt: expiryDate,
          }
        });
      }
    });
  }

  return { received: true };
};

export const PaymentService = {
  createCheckoutSession,
  handleWebhook,
};