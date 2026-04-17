import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PaymentService } from './payment.service';

const createCheckoutSession = catchAsync(async (req, res) => {
  const { id: userId } = req.user;
  const result = await PaymentService.createCheckoutSession(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Checkout session created successfully',
    data: result,
  });
});

// ✅ Stripe webhook — catchAsync ব্যবহার করা যাবে না!
// Stripe এর requirement: error হলে অবশ্যই 400 return করতে হবে
const webhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;

  if (!sig) {
    res.status(400).json({ success: false, message: 'Missing stripe-signature header' });
    return;
  }

  try {
    const result = await PaymentService.handleWebhook(sig, req.body);
    res.status(200).json({ success: true, message: 'Webhook received', data: result });
  } catch (err: any) {
    console.error('❌ Webhook handler error:', err.message);
    // Stripe কে 400 পাঠানো দরকার যাতে সে retry করে
    res.status(400).json({ success: false, message: err.message });
  }
};

export const PaymentController = {
  createCheckoutSession,
  webhook,
};
