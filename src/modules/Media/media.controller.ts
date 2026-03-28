import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { MediaService } from './media.service';

const getAllMedia = catchAsync(async (req, res) => {
  const result = await MediaService.getAllMedia(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Media retrieved successfully',
    data: result,
  });
});

const getSingleMedia = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MediaService.getSingleMedia(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Media retrieved successfully',
    data: result,
  });
});

const createMedia = catchAsync(async (req, res) => {
  const result = await MediaService.createMedia(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Media created successfully',
    data: result,
  });
});

const updateMedia = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MediaService.updateMedia(id as string, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Media updated successfully',
    data: result,
  });
});

const deleteMedia = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await MediaService.deleteMedia(id as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Media deleted successfully',
    data: result,
  });
});

export const MediaController = {
  getAllMedia,
  getSingleMedia,
  createMedia,
  updateMedia,
  deleteMedia,
};
