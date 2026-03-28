import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

// POST /api/v1/reviews/:id/like
const likeReview = async (reviewId: string, userId: string) => {
  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }

  // One like per user (enforced by DB unique constraint too)
  const existing = await prisma.like.findUnique({
    where: { userId_reviewId: { userId, reviewId } },
  });
  if (existing) {
    throw new AppError(httpStatus.CONFLICT, 'You have already liked this review');
  }

  const like = await prisma.like.create({
    data: { userId, reviewId },
  });

  return like;
};

// DELETE /api/v1/reviews/:id/like
const unlikeReview = async (reviewId: string, userId: string) => {
  const existing = await prisma.like.findUnique({
    where: { userId_reviewId: { userId, reviewId } },
  });

  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, 'You have not liked this review');
  }

  await prisma.like.delete({
    where: { userId_reviewId: { userId, reviewId } },
  });

  return { message: 'Like removed successfully' };
};

export const LikeService = {
  likeReview,
  unlikeReview,
};
