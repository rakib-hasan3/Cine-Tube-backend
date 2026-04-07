import { z } from 'zod';

const createPurchaseValidationSchema = z.object({
  body: z.object({
    // ১. মিডিয়া আইডি এখন অপশনাল, সাবস্ক্রিপশনের সময় এটা লাগবে না
    mediaId: z.string().optional().nullable(),

    // ২. পারচেজ টাইপগুলো আপনার Prisma Enum এর সাথে মিল থাকতে হবে
    // 'Free' এর বদলে 'BUY' রাখা ভালো, কারণ ফ্রি মুভি তো কেউ কেনে না, সে সরাসরি দেখে।
    type: z.enum(['BUY', 'RENT', 'SUBSCRIPTION']),

    // ৩. সাবস্ক্রিপশন প্ল্যান (আপনার লজিক অনুযায়ী: FREE, PREMIUM, FAMILY)
    subscriptionPlan: z.enum(['FREE', 'PREMIUM', 'FAMILY']).optional(),

    // ৪. তারিখ স্ট্রিং হিসেবে আসবে (ISOString)
    expiresAt: z.string().optional().nullable(),
  }),
});

export const PurchaseValidation = {
  createPurchaseValidationSchema,
};