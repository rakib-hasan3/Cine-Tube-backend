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

export const PaymentService = {
  createCheckoutSession,
};
