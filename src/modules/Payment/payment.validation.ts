import { z } from 'zod';

const createCheckoutSessionValidationSchema = z.object({
  body: z.object({
    mediaId: z.string({
      required_error: 'Media ID is required',
    }),
  }),
});

export const PaymentValidation = {
  createCheckoutSessionValidationSchema,
};
