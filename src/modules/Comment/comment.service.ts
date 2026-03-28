import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

export interface IComment {
  content: string;
  reviewId: string;
  userId: string;
  parentId?: string;
}

// POST /api/v1/comments
const createComment = async (payload: IComment) => {
  const review = await prisma.review.findUnique({ where: { id: payload.reviewId } });
  if (!review) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review not found');
  }

  // If parentId is provided, validate it exists on the same review
  if (payload.parentId) {
    const parent = await prisma.comment.findUnique({ where: { id: payload.parentId } });
    if (!parent || parent.reviewId !== payload.reviewId) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid parent comment');
    }
  }

  const comment = await prisma.comment.create({
    data: payload,
    include: {
      user: { select: { id: true, name: true } },
      replies: {
        include: { user: { select: { id: true, name: true } } },
      },
    },
  });

  return comment;
};

// GET /api/v1/comments/:reviewId
const getCommentsByReview = async (reviewId: string, query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  // Only top-level comments (no parentId), replies are nested
  const whereConditions = { reviewId, parentId: null };

  const [data, total] = await Promise.all([
    prisma.comment.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { createdAt: 'asc' },
      include: {
        user: { select: { id: true, name: true } },
        replies: {
          include: { user: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    }),
    prisma.comment.count({ where: whereConditions }),
  ]);

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const CommentService = {
  createComment,
  getCommentsByReview,
};
