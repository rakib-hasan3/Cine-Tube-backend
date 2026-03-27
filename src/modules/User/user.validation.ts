import { z } from 'zod';

const updateUserValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    role: z.enum(['USER', 'ADMIN']).optional(),
  }),
});

export const UserValidation = {
  updateUserValidationSchema,
};