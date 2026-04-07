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
  const { refreshToken, accessToken } = result;

  // কুকি অপশনগুলো এক জায়গায় রাখা ভালো যাতে ভুল না হয়
  const cookieOptions = {
    secure: config.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const, // এখানে lax দিলে লগআউটেও lax দিতে হবে
    path: '/',
  };

  // ১. Refresh Token সেট করা
  res.cookie('refreshToken', refreshToken, cookieOptions);

  // ২. যদি Access Token-ও কুকিতে পাঠাতে চান তবে নিচের লাইনটি আনকমেন্ট করুন
  // res.cookie('accessToken', accessToken, cookieOptions);

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
  // একদম মিনিমাল অপশন - লোকালহোস্টের জন্য এটাই বেস্ট
  const cookieOptions = {
    httpOnly: true,
    secure: false, // লোকালহোস্টে অবশ্যই false রাখবেন
    path: '/',
  };

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Logged out successfully!',
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