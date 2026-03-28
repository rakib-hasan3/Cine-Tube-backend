import { ReviewStatus } from '../../../generated/prisma/client';

export interface IReview {
  rating: number;
  content: string;
  tags: string[];
  spoiler: boolean;
  mediaId: string;
  userId: string;
}

export interface IReviewUpdate {
  rating?: number;
  content?: string;
  tags?: string[];
  spoiler?: boolean;
}

export interface IReviewStatusUpdate {
  status: ReviewStatus;
}
