import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { PaymentController } from './payment.controller';
import { PaymentValidation } from './payment.validation';

const router = express.Router();

router.post(
  '/create-session',
  auth('USER', 'ADMIN'),
  validateRequest(PaymentValidation.createCheckoutSessionValidationSchema),
  PaymentController.createCheckoutSession,
);

// রাকিব ভাই, এখানে খেয়াল করুন: 
// আমরা শুধু এই রাউটের জন্য express.raw() ব্যবহার করছি।
// এটি না করলে Stripe এর পাঠানো সিগনেচার (400 Error) কাজ করবে না।
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }), // এই লাইনটি যোগ করা হয়েছে
  PaymentController.webhook // আপনার কন্ট্রোলারের নাম অনুযায়ী (webhook বা handleWebhook)
);

export const PaymentRoutes = router;