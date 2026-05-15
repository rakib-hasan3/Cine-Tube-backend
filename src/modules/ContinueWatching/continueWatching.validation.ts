import { z } from 'zod';

const updateProgressValidationSchema = z.object({
  body: z.object({
    movieId: z.string().uuid('Invalid movie ID'),
    currentTime: z.number().min(0, 'Current time must be positive'),
    duration: z.number().positive('Duration must be positive'),
  }),
});

export const ContinueWatchingValidation = {
  updateProgressValidationSchema,
};
