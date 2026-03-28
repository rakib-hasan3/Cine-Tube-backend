import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ReviewService } from './review.service';

// POST /api/v1/reviews
const createReview = catchAsync(async (req, res) => {
  const userId = req.user?.id as string;
  const result = await ReviewService.createReview({ ...req.body, userId });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Review submitted successfully and is pending approval',
    data: result,
  });
});

// GET /api/v1/reviews/:mediaId
const getReviewsByMedia = catchAsync(async (req, res) => {
  const { mediaId } = req.params;
  const result = await ReviewService.getReviewsByMedia(mediaId as string, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});

// PATCH /api/v1/reviews/:id
const updateReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id as string;
  const result = await ReviewService.updateReview(id as string, userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review updated successfully',
    data: result,
  });
});

// DELETE /api/v1/reviews/:id
const deleteReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id as string;
  const role = req.user?.role as string;
  const result = await ReviewService.deleteReview(id as string, userId, role);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review deleted successfully',
    data: result,
  });
});

// PATCH /api/v1/reviews/:id/status  (ADMIN)
const updateReviewStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await ReviewService.updateReviewStatus(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Review status updated successfully',
    data: result,
  });
});

export const ReviewController = {
  createReview,
  getReviewsByMedia,
  updateReview,
  deleteReview,
  updateReviewStatus,
};
