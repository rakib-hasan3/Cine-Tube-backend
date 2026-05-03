import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { getHybridChatResponse } from './ai.service';

const hybridChat = catchAsync(async (req, res) => {
  const { movieId, userId, message } = req.body;

  if (!movieId || !message) {
    return sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: 'movieId and message are required',
      data: null,
    });
  }

  const result = await getHybridChatResponse(movieId, userId, message);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'AI response generated successfully',
    data: result,
  });
});

export const AiController = {
  hybridChat,
};
