import { z } from 'zod';

const createPurchaseValidationSchema = z.object({
  body: z.object({
    mediaId: z.string().uuid('Invalid media ID'),
    type: z.enum(['BUY', 'RENT', 'SUBSCRIPTION']),
    expiresAt: z.string().datetime().optional(),
  }),
});

export const PurchaseValidation = {
  createPurchaseValidationSchema,
};
