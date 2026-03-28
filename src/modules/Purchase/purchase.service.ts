import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { IPurchase } from './purchase.interface';

// POST /api/v1/purchases
const createPurchase = async (userId: string, payload: IPurchase) => {
  const media = await prisma.media.findUnique({ where: { id: payload.mediaId } });
  if (!media || media.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Media not found');
  }

  // Cannot purchase free media
  if (media.priceType === 'FREE') {
    throw new AppError(httpStatus.BAD_REQUEST, 'This media is free and does not require purchase');
  }

  // Prevent duplicate non-expired purchases
  const now = new Date();
  const existingPurchase = await prisma.purchase.findFirst({
    where: {
      userId,
      mediaId: payload.mediaId,
      type: payload.type,
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
    },
  });

  if (existingPurchase) {
    throw new AppError(httpStatus.CONFLICT, 'You already have an active purchase for this media');
  }

  const purchase = await prisma.purchase.create({
    data: {
      userId,
      mediaId: payload.mediaId,
      type: payload.type,
      expiresAt: payload.expiresAt ?? null,
    },
    include: {
      media: { select: { id: true, title: true } },
    },
  });

  return purchase;
};

// GET /api/v1/purchases  — user's purchase history
const getPurchaseHistory = async (userId: string, query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.purchase.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        media: { select: { id: true, title: true, priceType: true, youtubeLink: true } },
      },
    }),
    prisma.purchase.count({ where: { userId } }),
  ]);

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

// GET /api/v1/purchases/all  — ADMIN: all purchases
const getAllPurchases = async (query: Record<string, unknown>) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.purchase.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        media: { select: { id: true, title: true } },
      },
    }),
    prisma.purchase.count(),
  ]);

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const PurchaseService = {
  createPurchase,
  getPurchaseHistory,
  getAllPurchases,
};
