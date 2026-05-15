import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

/**
 * Save or update progress
 */
const updateProgress = async (
  userId: string,
  movieId: string,
  currentTime: number,
  duration: number,
) => {
  const media = await prisma.media.findUnique({ where: { id: movieId } });
  if (!media || media.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Media not found');
  }

  const progress = (currentTime / duration) * 100;

  // If progress >= 90 → delete the record (auto remove)
  if (progress >= 90) {
    await prisma.continueWatching.deleteMany({
      where: { userId, movieId },
    });
    return { message: 'Progress completed and record removed', progress };
  }

  // Update or create using UPSERT logic
  const result = await prisma.continueWatching.upsert({
    where: {
      userId_movieId: { userId, movieId },
    },
    update: {
      currentTime,
      duration,
      progress,
    },
    create: {
      userId,
      movieId,
      currentTime,
      duration,
      progress,
    },
    include: {
      media: {
        select: {
          id: true,
          title: true,
          posterUrl: true,
          duration: true,
        },
      },
    },
  });

  return result;
};

/**
 * Get user's continue watching list
 */
const getContinueWatchingList = async (userId: string) => {
  const items = await prisma.continueWatching.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    take: 10,
    include: {
      media: {
        select: {
          id: true,
          title: true,
          posterUrl: true,
          backdropUrl: true,
          duration: true,
        },
      },
    },
  });

  return items;
};

/**
 * Remove manually
 */
const removeManually = async (userId: string, movieId: string) => {
  const existing = await prisma.continueWatching.findUnique({
    where: {
      userId_movieId: { userId, movieId },
    },
  });

  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, 'Record not found');
  }

  await prisma.continueWatching.delete({
    where: {
      userId_movieId: { userId, movieId },
    },
  });

  return { message: 'Removed from continue watching' };
};

export const ContinueWatchingService = {
  updateProgress,
  getContinueWatchingList,
  removeManually,
};
