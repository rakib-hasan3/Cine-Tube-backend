import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PaymentController } from './payment.controller';
import { PaymentValidation } from './payment.validation';

const router = express.Router();
// router.post(
//   '/webhook',
//   express.raw({ type: 'application/json' }), // এই লাইনটি যোগ করা হয়েছে
//   PaymentController.webhook // আপনার কন্ট্রোলারের নাম অনুযায়ী (webhook বা handleWebhook)
// );


router.post(
  '/create-session',
  auth('USER', 'ADMIN'),
  validateRequest(PaymentValidation.createCheckoutSessionValidationSchema),
  PaymentController.createCheckoutSession,
);



export const PaymentRoutes = router;