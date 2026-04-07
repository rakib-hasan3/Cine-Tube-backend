import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { AuthController } from './auth.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
  '/register',
  validateRequest(AuthValidation.registerValidationSchema),
  AuthController.registerUser
);

router.post(
  '/login',
  validateRequest(AuthValidation.loginValidationSchema),
  AuthController.loginUser
);
router.post(
  '/refresh-token',
  validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthController.refreshToken,
);
router.get('/me', auth(), AuthController.getMe);

router.post(
  '/logout',
  AuthController.logoutUser // এই ফাংশনটি আমরা কন্ট্রোলারে বানাবো
);
export const AuthRoutes = router;
