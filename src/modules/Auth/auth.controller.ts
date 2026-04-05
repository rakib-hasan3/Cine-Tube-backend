import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthService } from './auth.service';
import { TAuthUser } from './auth.interface';
import config from '../../config';
import { fa } from 'zod/v4/locales';

const registerUser = catchAsync(async (req, res) => {
  const result = await AuthService.registerUser(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUser(req.body);

  const { refreshToken, accessToken, user } = result;

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully',
    data: result,
  });
});

// auth.controller.ts
// auth.controller.ts
const getMe = catchAsync(async (req, res) => {
  // এখানে Type Casting করে দিতে হবে (as TAuthUser)
  const user = req.user as TAuthUser;
  const result = await AuthService.getMe(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  });
});
const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token is retrieved successfully!',
    data: result,
  });
});

const logoutUser = catchAsync(async (req, res) => {
  // await AuthService.logoutUser(); 

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    path: '/',
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged out successfully',
    data: null,
  });
});
export const AuthController = {
  registerUser,
  loginUser,
  getMe,
  refreshToken,
  logoutUser
};