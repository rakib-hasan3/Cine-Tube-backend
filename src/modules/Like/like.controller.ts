import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { LikeService } from './like.service';

// POST /api/v1/reviews/:id/like
const likeReview = catchAsync(async (req, res) => {
  const { id: reviewId } = req.params;
  const userId = req.user?.id as string;
  const result = await LikeService.likeReview(reviewId as string, userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review liked successfully',
    data: result,
  });
});

// DELETE /api/v1/reviews/:id/like
const unlikeReview = catchAsync(async (req, res) => {
  const { id: reviewId } = req.params;
  const userId = req.user?.id as string;
  const result = await LikeService.unlikeReview(reviewId as string, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Like removed successfully',
    data: result,
  });
});

export const LikeController = {
  likeReview,
  unlikeReview,
};
