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
    data: {
      ...payload,
      spoiler: payload?.spoiler ?? false, // ✅ FIX
      status: "APPROVED",
    },

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
    status: 'APPROVED',
  };

  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where: {
        mediaId,

        // 🔥 শুধু approved না, নিজের review-ও দেখাবে
        OR: [
          { status: "APPROVED" },
          ...(query.userId
            ? [{ userId: query.userId as string }]
            : []),
        ],
      },

      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },

      include: {
        user: {
          select: { id: true, name: true },
        },

        // 🔥 likes + comments count
        _count: {
          select: { likes: true, comments: true },
        },
      },
    }),

    prisma.review.count({
      where: {
        mediaId,
        OR: [
          { status: "APPROVED" },
          ...(query.userId
            ? [{ userId: query.userId as string }]
            : []),
        ],
      },
    }),
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
// D:\Assignment Type Script project\cine-tube-backend\src\modules\Review\review.service.ts

const deleteReview = async (id: string, userId: string, role: string) => {
  const review = await prisma.review.findUnique({ where: { id } });

  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }

  // Owner or admin can delete
  if (review.userId !== userId && role !== 'ADMIN') {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not allowed to delete this review');
  }

  // 🔥 এখানে ট্রানজেকশন ব্যবহার করে সব রিলেটেড ডাটা ডিলিট করতে হবে
  await prisma.$transaction(async (tx) => {
    // ১. প্রথমে এই রিভিউর সব লাইক মুছুন
    await tx.like.deleteMany({
      where: { reviewId: id }
    });

    // ২. এই রিভিউর সব কমেন্ট মুছুন 
    // (যদি কমেন্টের ভেতরে রিপ্লাই থাকে তবে সেগুলো আগে মুছতে হতে পারে, তাই Cascade ভালো)
    await tx.comment.deleteMany({
      where: { reviewId: id }
    });

    // ৩. সবশেষে রিভিউ মুছুন
    await tx.review.delete({
      where: { id }
    });
  });

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


const getAllReviews = async () => {
  const result = await prisma.review.findMany({
    include: {
      user: true,   // ইউজারের নাম দেখানোর জন্য
      media: true,  // মুভির টাইটেল দেখানোর জন্য
    },
    orderBy: { createdAt: 'desc' },
  });
  return result;
};
export const ReviewService = {
  createReview,
  getReviewsByMedia,
  updateReview,
  deleteReview,
  updateReviewStatus,
  getAllReviews
};
