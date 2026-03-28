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

const webhook = catchAsync(async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  const result = await PaymentService.handleWebhook(sig, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Webhook received',
    data: result,
  });
});

export const PaymentController = {
  createCheckoutSession,
  webhook,
};
