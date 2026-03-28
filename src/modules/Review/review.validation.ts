import { z } from 'zod';

const createReviewValidationSchema = z.object({
  body: z.object({
    rating: z
      .number()
      .int()
      .min(1, 'Rating must be at least 1')
      .max(10, 'Rating must be at most 10'),
    content: z.string().min(1, 'Review content cannot be empty'),
    tags: z.array(z.string()).optional().default([]),
    spoiler: z.boolean().optional().default(false),
    mediaId: z.string().uuid('Invalid media ID'),
  }),
});

const updateReviewValidationSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(10).optional(),
    content: z.string().min(1).optional(),
    tags: z.array(z.string()).optional(),
    spoiler: z.boolean().optional(),
  }),
});

const updateReviewStatusValidationSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  }),
});

export const ReviewValidation = {
  createReviewValidationSchema,
  updateReviewValidationSchema,
  updateReviewStatusValidationSchema,
};
