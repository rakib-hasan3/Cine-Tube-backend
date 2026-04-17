import { Genre, MediaType, PriceType } from '../../../generated/prisma/client';

export interface IMedia {
  title: string;
  description: string;
  genre: Genre[];
  releaseYear: number;
  director: string;
  cast: string[];
  platform: string[];
  priceType: PriceType;
  price: number; // <--- এই লাইনটি যোগ করুন
  youtubeLink: string;
  posterUrl: string;   // পোস্টারের জন্য
  backdropUrl?: string; // ব্যাকড্রপের জন্য (ঐচ্ছিক)
  type: MediaType;
}

export interface IMediaUpdate extends Partial<IMedia> { }