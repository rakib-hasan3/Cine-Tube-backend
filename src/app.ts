import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './middlewares/globalErrorhandler';
import notFound from './middlewares/notFound';
import router from './routes';
import { PaymentController } from './modules/Payment/payment.controller';

const app: Application = express();

// ✅ CORS সবার আগে (Stripe webhook সহ সব request এ দরকার)
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// ✅ Stripe webhook — MUST be before express.json() body parser
// express.json() parse করলে raw body নষ্ট হয়, তাই আগে রাখতে হবে
app.post(
  '/api/v1/payments/webhook',
  express.raw({ type: 'application/json' }), // raw body লাগবে signature verify করতে
  PaymentController.webhook
);

// ✅ Other routes এর জন্য JSON body parser
app.use(express.json());
app.use(cookieParser());

// Application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('CineTube Backend is running! 🎬');
});

// Global error handler
app.use(globalErrorHandler);

// Not found handler
app.use(notFound);

export default app;