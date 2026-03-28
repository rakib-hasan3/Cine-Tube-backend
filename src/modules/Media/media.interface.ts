import { MediaType, PriceType } from '../../../generated/prisma/client';

export interface IMedia {
  title: string;
  description: string;
  genre: string[];
  releaseYear: number;
  director: string;
  cast: string[];
  platform: string[];
  priceType: PriceType;
  youtubeLink: string;
  type: MediaType;
}

export interface IMediaUpdate extends Partial<IMedia> {}
