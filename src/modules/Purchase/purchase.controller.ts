import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { PurchaseService } from './purchase.service';

// POST /api/v1/purchases
const createPurchase = catchAsync(async (req, res) => {
  const userId = req.user?.id as string;
  const result = await PurchaseService.createPurchase(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Purchase created successfully',
    data: result,
  });
});

// GET /api/v1/purchases  — personal history
const getPurchaseHistory = catchAsync(async (req, res) => {
  const userId = req.user?.id as string;
  const result = await PurchaseService.getPurchaseHistory(userId, req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Purchase history retrieved successfully',
    data: result,
  });
});

// GET /api/v1/purchases/all  — ADMIN
const getAllPurchases = catchAsync(async (req, res) => {
  const result = await PurchaseService.getAllPurchases(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All purchases retrieved successfully',
    data: result,
  });
});

export const PurchaseController = {
  createPurchase,
  getPurchaseHistory,
  getAllPurchases,
};
