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
  });

  if (!media || media.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Media not found');
  }

  return media;
};

const createMedia = async (payload: IMedia) => {
  const media = await prisma.media.create({
    data: payload,
  });

  return media;
};

const updateMedia = async (id: string, payload: IMediaUpdate) => {
  const existing = await prisma.media.findUnique({ where: { id } });

  if (!existing || existing.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Media not found');
  }

  const media = await prisma.media.update({
    where: { id },
    data: payload,
  });

  return media;
};

const deleteMedia = async (id: string) => {
  const existing = await prisma.media.findUnique({ where: { id } });

  if (!existing || existing.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Media not found');
  }

  // Soft delete
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
