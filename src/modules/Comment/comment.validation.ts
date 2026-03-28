import { z } from 'zod';

const createCommentValidationSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Comment cannot be empty'),
    reviewId: z.string().uuid('Invalid review ID'),
    parentId: z.string().uuid('Invalid parent comment ID').optional(),
  }),
});

export const CommentValidation = {
  createCommentValidationSchema,
};
