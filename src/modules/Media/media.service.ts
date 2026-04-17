import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { IMedia, IMediaUpdate } from './media.interface';

const getAllMedia = async (query: Record<string, unknown>) => {
  const searchTerm = query.searchTerm as string | undefined;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const whereConditions: Record<string, unknown> = {
    isDeleted: false,
  };

  if (searchTerm) {
    whereConditions.OR = [
      { title: { contains: searchTerm, mode: 'insensitive' } },
      { description: { contains: searchTerm, mode: 'insensitive' } },
      { director: { contains: searchTerm, mode: 'insensitive' } },
    ];
  }

  const [data, total] = await Promise.all([
    prisma.media.findMany({
      where: whereConditions,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        reviews: true,
      },
    }),
    prisma.media.count({ where: whereConditions }),
  ]);

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

const getSingleMedia = async (id: string) => {
  const media = await prisma.media.findUnique({
    where: { id },
    include: {
      reviews: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!media || media.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Media not found');
  }

  return media;
};

const createMedia = async (payload: any) => {
  const { genre, cast, platform, releaseYear, price, ...otherData } = payload;

  // ✅ SAFE CONVERSION (crash prevent)
  const safeGenre = Array.isArray(genre) ? genre : genre ? [genre] : [];
  const safeCast = Array.isArray(cast) ? cast : cast ? [cast] : [];
  const safePlatform = Array.isArray(platform) ? platform : platform ? [platform] : ["Web"];

  // ✅ VALIDATION (optional but recommended)
  if (safeGenre.length === 0) {
    throw new AppError(400, 'At least one genre is required');
  }

  if (safeCast.length === 0) {
    throw new AppError(400, 'At least one cast member is required');
  }

  const result = await prisma.media.create({
    data: {
      title: otherData.title,
      description: otherData.description,
      posterUrl: otherData.posterUrl,
      backdropUrl: otherData.backdropUrl,
      director: otherData.director,
      youtubeLink: otherData.youtubeLink,
      priceType: otherData.priceType,
      type: otherData.type,

      // ✅ number নিশ্চিত করা
      releaseYear: Number(releaseYear),
      price: Number(price || 0),

      // ✅ Prisma array format (safe)
      genre: { set: safeGenre },
      cast: { set: safeCast },
      platform: { set: safePlatform },
    },
  });

  return result;
};
const updateMedia = async (id: string, payload: IMediaUpdate) => {
  const existing = await prisma.media.findUnique({ where: { id } });

  if (!existing || existing.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Media not found');
  }

  const media = await prisma.media.update({
    where: { id },
    data: {
      ...payload,
      // ১. রিলিজ ইয়ার নাম্বার করা হচ্ছে
      ...(payload.releaseYear && { releaseYear: Number(payload.releaseYear) }),

      // ২. ভুলটা এখানে ছিল: payload.price কে নাম্বার করতে হবে, priceType কে নয়!
      // এবং যদি priceType FREE হয় তবে অটো ০ বসবে
      price: payload.priceType === "FREE" ? 0 : Number(payload.price ?? existing.price),

      // ৩. জেনার এবং কাস্ট অ্যারে হ্যান্ডলিং
      ...(payload.genre && { genre: Array.isArray(payload.genre) ? payload.genre : [] }),
      ...(payload.cast && { cast: Array.isArray(payload.cast) ? payload.cast : [] }),
    },
  });

  return media;
};

const deleteMedia = async (id: string) => {
  const existing = await prisma.media.findUnique({ where: { id } });

  if (!existing || existing.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Media not found');
  }

  const media = await prisma.media.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date(),
    },
  });

  return media;
};

export const MediaService = {
  getAllMedia,
  getSingleMedia,
  createMedia,
  updateMedia,
  deleteMedia,
};