import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

// POST /api/v1/watchlist
const addToWatchlist = async (userId: string, mediaId: string) => {
  const media = await prisma.media.findUnique({ where: { id: mediaId } });
  if (!media || media.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Media not found');
  }

  const existing = await prisma.watchlist.findUnique({
    where: { userId_mediaId: { userId, mediaId } },
  });
  if (existing) {
    throw new AppError(httpStatus.CONFLICT, 'Media is already in your watchlist');
  }

  const item = await prisma.watchlist.create({
    data: { userId, mediaId },
    include: { media: { select: { id: true, title: true } } },
  });

  return item;
};

// GET /api/v1/watchlist
const getWatchlist = async (userId: string) => {
  const items = await prisma.watchlist.findMany({
    where: { userId },
    orderBy: { id: 'asc' },
    include: {
      media: {
        select: {
          id: true,
          title: true,
          description: true,
          genre: true,
          releaseYear: true,
          priceType: true,
          youtubeLink: true,
        },
      },
    },
  });

  return items;
};

// DELETE /api/v1/watchlist/:id
const removeFromWatchlist = async (id: string, userId: string) => {
  const item = await prisma.watchlist.findUnique({ where: { id } });

  if (!item) {
    throw new AppError(httpStatus.NOT_FOUND, 'Watchlist item not found');
  }

  if (item.userId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, 'You cannot remove this item');
  }

  await prisma.watchlist.delete({ where: { id } });

  return { message: 'Removed from watchlist' };
};

export const WatchlistService = {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
};
