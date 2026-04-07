import { z } from 'zod';

const createCheckoutSessionValidationSchema = z.object({
  body: z.object({
    // ১. mediaId কে optional এবং nullable করুন
    mediaId: z.string().optional().nullable(),

    // ২. সাবস্ক্রিপশন প্ল্যান এনাম যোগ করুন (এটাও অপশনাল)
    subscriptionPlan: z.enum(['FREE', 'PREMIUM', 'FAMILY']).optional(),
  })
    // ৩. লজিক্যাল চেক: অন্তত যেকোনো একটা ফিল্ড থাকতে হবে
    .refine((data) => data.mediaId || data.subscriptionPlan, {
      message: "Either mediaId or subscriptionPlan must be provided",
      path: ["mediaId"],
    }),
});

export const PaymentValidation = {
  createCheckoutSessionValidationSchema,
};