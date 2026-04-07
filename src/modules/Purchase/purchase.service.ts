import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { IPurchase } from './purchase.interface';

// purchase.service.ts

const createPurchase = async (userId: string, payload: IPurchase) => {
  // ১. মেয়াদের হিসাব (আজ থেকে ৩০ দিন)
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + 1);

  return await prisma.$transaction(async (tx) => {
    // ২. পারচেজ রেকর্ড তৈরি
    const purchase = await tx.purchase.create({
      data: {
        userId,
        type: 'SUBSCRIPTION', // আপনার Enum অনুযায়ী
        mediaId: null,        // গ্লোবাল এক্সেসের জন্য এটা null
        expiresAt: expiryDate,
      }
    });

    // ৩. ইউজারের প্রোফাইল আপডেট (Global Access)
    await tx.user.update({
      where: { id: userId },
      data: {
        subscription: payload.subscriptionPlan as any, // 'PREMIUM', 'FAMILY' ইত্যাদি
        planExpiresAt: expiryDate
      }
    });

    return purchase;
  });
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

const canUserWatch = async (userId: string, mediaId: string) => {
  const [user, media] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.media.findUnique({ where: { id: mediaId } })
  ]);

  // ১. মুভি ফ্রি হলে সবাই দেখবে
  if (media?.priceType === 'FREE') return true;

  // ২. ইউজারের যদি একটিভ সাবস্ক্রিপশন থাকে (Global Access)
  if (user?.subscription !== 'FREE' && user?.planExpiresAt && user.planExpiresAt > new Date()) {
    return true;
  }

  // ৩. ইউজার যদি এই নির্দিষ্ট মুভিটি আলাদাভাবে কিনে থাকে
  const hasPurchased = await prisma.purchase.findFirst({
    where: { userId, mediaId, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] }
  });

  return !!hasPurchased;
};

export const PurchaseService = {
  createPurchase,
  getPurchaseHistory,
  getAllPurchases,
  canUserWatch,
};
