import { z } from 'zod';

const createMediaValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title cannot be empty'),
    description: z.string().min(1, 'Description cannot be empty'),
    genre: z.array(z.string()).min(1, 'At least one genre is required'),
    releaseYear: z
      .number()
      .int()
      .min(1888, 'Year must be valid')
      .max(new Date().getFullYear() + 5, 'Release year too far in future'),
    director: z.string().min(1, 'Director is required'),
    cast: z.array(z.string()).min(1, 'At least one cast member is required'),
    platform: z.array(z.string()).min(1, 'At least one platform is required'),
    priceType: z.enum(['FREE', 'PREMIUM']),
    youtubeLink: z.string().url('Must be a valid URL'),
    type: z.enum(['MOVIE', 'SERIES']),
  }),
});

const updateMediaValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    genre: z.array(z.string()).min(1).optional(),
    releaseYear: z
      .number()
      .int()
      .min(1888)
      .max(new Date().getFullYear() + 5)
      .optional(),
    director: z.string().min(1).optional(),
    cast: z.array(z.string()).min(1).optional(),
    platform: z.array(z.string()).min(1).optional(),
    priceType: z.enum(['FREE', 'PREMIUM']).optional(),
    youtubeLink: z.string().url().optional(),
    type: z.enum(['MOVIE', 'SERIES']).optional(),
  }),
});

export const MediaValidation = {
  createMediaValidationSchema,
  updateMediaValidationSchema,
};
