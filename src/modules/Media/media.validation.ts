import { z } from 'zod';

const createMediaValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title cannot be empty'),
    description: z.string().min(1, 'Description cannot be empty'),
    genre: z.array(z.string()).min(1, 'At least one genre is required'),
    // নাম্বার কনভার্ট করার জন্য preprocess যোগ করা হয়েছে
    releaseYear: z.preprocess((val) => Number(val), z
      .number()
      .int()
      .min(1888, 'Year must be valid')
      .max(new Date().getFullYear() + 5, 'Release year too far in future')),
    director: z.string().min(1, 'Director is required'),
    cast: z.array(z.string()).min(1, 'At least one cast member is required'),
    // প্ল্যাটফর্ম ডিফল্ট হিসেবে ['Web'] নিয়ে নিবে যদি খালি থাকে
    platform: z.array(z.string()).default(['Web']),
    priceType: z.enum(['FREE', 'PREMIUM']),
    // প্রাইস ফিল্ডটি আগে ছিল না, এখন অ্যাড করা হয়েছে
    price: z.preprocess((val) => Number(val || 0), z.number().min(0)),
    youtubeLink: z.string().url('Must be a valid URL'),
    // পোস্টার ও ব্যাকড্রপ ফিল্ডগুলো যোগ করা হয়েছে
    posterUrl: z.string().url('Invalid Poster URL'),
    backdropUrl: z.string().url('Invalid Backdrop URL').optional().or(z.literal('')),
    type: z.enum(['MOVIE', 'SERIES']),
  }),
});

const updateMediaValidationSchema = z.object({
  body: z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    genre: z.array(z.string()).min(1).optional(),
    releaseYear: z.preprocess((val) => (val ? Number(val) : undefined), z
      .number()
      .int()
      .min(1888)
      .max(new Date().getFullYear() + 5)
      .optional()),
    director: z.string().min(1).optional(),
    cast: z.array(z.string()).min(1).optional(),
    platform: z.array(z.string()).min(1).optional(),
    priceType: z.enum(['FREE', 'PREMIUM']).optional(),
    price: z.preprocess((val) => (val !== undefined ? Number(val) : undefined), z.number().min(0).optional()),
    youtubeLink: z.string().url().optional(),
    posterUrl: z.string().url().optional(),
    backdropUrl: z.string().url().optional().or(z.literal('')),
    type: z.enum(['MOVIE', 'SERIES']).optional(),
  }),
});

export const MediaValidation = {
  createMediaValidationSchema,
  updateMediaValidationSchema,
};