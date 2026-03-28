import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CommentService } from './comment.service';

// POST /api/v1/comments
const createComment = catchAsync(async (req, res) => {
  const userId = req.user?.id as string;
  const result = await CommentService.createComment({ ...req.body, userId });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Comment posted successfully',
    data: result,
  });
});

// GET /api/v1/comments/:reviewId
const getCommentsByReview = catchAsync(async (req, res) => {
  const { reviewId } = req.params;
  const result = await CommentService.getCommentsByReview(reviewId as string, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Comments retrieved successfully',
    data: result,
  });
});

export const CommentController = {
  createComment,
  getCommentsByReview,
};
