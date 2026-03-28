import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { IReview, IReviewStatusUpdate, IReviewUpdate } from './review.interface';

// POST /api/v1/reviews
const createReview = async (payload: IReview) => {
  // Ensure the media exists
  const media = await prisma.media.findUnique({ where: { id: payload.mediaId } });
  if (!media || media.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Media not found');
  }

  // A user can only submit one review per media
  const existing = await prisma.review.findFirst({
    where: { userId: payload.userId, mediaId: payload.mediaId },
  });
  if (existing) {
    throw new AppError(httpStatus.CONFLICT, 'You have already reviewed this media');
  }

  const review = await prisma.review.create({
    data: payload,
    include: {
      user: { select: { id: true, name: true, email: true } },
      media: { select: { id: true, title: true } },
    },
  });

  return review;
};

// GET /api/v1/reviews/:mediaId
const getReviewsByMedia = async (mediaId: string, query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const whereConditions = {
    mediaId,
    status: 'APPROVED' as const,
  };

  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true } },
        _count: { select: { likes: true, comments: true } },
      },
    }),
    prisma.review.count({ where: whereConditions }),
  ]);

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

// PATCH /api/v1/reviews/:id
const updateReview = async (id: string, userId: string, payload: IReviewUpdate) => {
  const review = await prisma.review.findUnique({ where: { id } });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }

  if (review.userId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not allowed to update this review');
  }

  const updated = await prisma.review.update({
    where: { id },
    data: payload,
    include: {
      user: { select: { id: true, name: true } },
    },
  });

  return updated;
};

// DELETE /api/v1/reviews/:id
const deleteReview = async (id: string, userId: string, role: string) => {
  const review = await prisma.review.findUnique({ where: { id } });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }

  // Owner or admin can delete
  if (review.userId !== userId && role !== 'ADMIN') {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not allowed to delete this review');
  }

  await prisma.review.delete({ where: { id } });

  return { message: 'Review deleted successfully' };
};

// PATCH /api/v1/reviews/:id/status  (ADMIN)
const updateReviewStatus = async (id: string, payload: IReviewStatusUpdate) => {
  const review = await prisma.review.findUnique({ where: { id } });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }

  const updated = await prisma.review.update({
    where: { id },
    data: { status: payload.status },
  });

  return updated;
};

export const ReviewService = {
  createReview,
  getReviewsByMedia,
  updateReview,
  deleteReview,
  updateReviewStatus,
};
