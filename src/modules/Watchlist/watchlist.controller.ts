import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { WatchlistService } from './watchlist.service';

// POST /api/v1/watchlist
const addToWatchlist = catchAsync(async (req, res) => {
  const userId = req.user?.id as string;
  const { mediaId } = req.body;
  const result = await WatchlistService.addToWatchlist(userId, mediaId as string);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Added to watchlist successfully',
    data: result,
  });
});

// GET /api/v1/watchlist
const getWatchlist = catchAsync(async (req, res) => {
  const userId = req.user?.id as string;
  const result = await WatchlistService.getWatchlist(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Watchlist retrieved successfully',
    data: result,
  });
});

// DELETE /api/v1/watchlist/:id
const removeFromWatchlist = catchAsync(async (req, res) => {
  const { id } = req.params;
  const userId = req.user?.id as string;
  const result = await WatchlistService.removeFromWatchlist(id as string, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Removed from watchlist successfully',
    data: result,
  });
});

export const WatchlistController = {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
};
