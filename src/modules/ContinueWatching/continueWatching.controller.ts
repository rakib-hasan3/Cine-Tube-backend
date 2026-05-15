import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ContinueWatchingService } from './continueWatching.service';

/**
 * Update progress
 */
const updateProgress = catchAsync(async (req, res) => {
  const userId = req.user?.id as string;
  const { movieId, currentTime, duration } = req.body;

  const result = await ContinueWatchingService.updateProgress(
    userId,
    movieId as string,
    Number(currentTime),
    Number(duration),
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Progress updated successfully',
    data: result,
  });
});

/**
 * Get continue watching list
 */
const getContinueWatchingList = catchAsync(async (req, res) => {
  const userId = req.user?.id as string;
  const result = await ContinueWatchingService.getContinueWatchingList(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Continue watching list retrieved successfully',
    data: result,
  });
});

/**
 * Remove manually
 */
const removeManually = catchAsync(async (req, res) => {
  const userId = req.user?.id as string;
  const { movieId } = req.params;

  const result = await ContinueWatchingService.removeManually(userId, movieId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Removed from continue watching successfully',
    data: result,
  });
});

export const ContinueWatchingController = {
  updateProgress,
  getContinueWatchingList,
  removeManually,
};
