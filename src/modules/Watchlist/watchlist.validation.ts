import { z } from 'zod';

const addToWatchlistValidationSchema = z.object({
  body: z.object({
    mediaId: z.string().uuid('Invalid media ID'),
  }),
});

export const WatchlistValidation = {
  addToWatchlistValidationSchema,
};
