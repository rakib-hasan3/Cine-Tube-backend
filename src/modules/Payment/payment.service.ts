import Stripe from 'stripe';
import config from '../../config';
import { prisma } from '../../lib/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TCreateCheckoutSession } from './payment.interface';

const stripe = new Stripe(config.stripe_secret_key as string, {
  apiVersion: '2025-01-27.acacia',
});

const createCheckoutSession = async (userId: string, payload: TCreateCheckoutSession) => {
  const media = await prisma.media.findUnique({
    where: { id: payload.mediaId },
  });

  if (!media) {
    throw new AppError(httpStatus.NOT_FOUND, 'Media not found');
  }

  if (media.price <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'This media is free');
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: media.title,
            description: media.description,
          },
          unit_amount: media.price,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `http://localhost:3000/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:3000/payment-cancel`,
    customer_email: user?.email,
    metadata: {
      userId,
      mediaId: media.id,
    },
  });

  // Create PENDING payment record
  await prisma.payment.create({
    data: {
      amount: media.price,
      userId,
      mediaId: media.id,
      sessionId: session.id,
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
    const { userId, mediaId } = session.metadata as any;

    // Update payment record
    const payment = await prisma.payment.update({
      where: { sessionId: session.id },
      data: {
        status: 'SUCCESS',
        transactionId: session.payment_intent as string,
      },
    });

    // Create purchase record
    if (mediaId) {
      await prisma.purchase.create({
        data: {
          userId,
          mediaId,
          type: 'BUY', // Default for checkout
        },
      });
    }
  }

  if (event.type === 'checkout.session.expired' || event.type === 'payment_intent.payment_failed') {
    const session = event.data.object as any;
    const sessionId = session.id || session.metadata?.sessionId;

    if (sessionId) {
      await prisma.payment.update({
        where: { sessionId },
        data: { status: 'FAILED' },
      });
    }
  }

  return { received: true };
};

export const PaymentService = {
  createCheckoutSession,
  handleWebhook,
};
