import { z } from 'zod';

const registerValidationSchema = z.object({
  body: z.object({
    name: z.string({
      message: 'Name is required',
    }),
    email: z.string({
      message: 'Email is required',
    }).email('Invalid email address'),
    password: z.string({
      message: 'Password is required',
    }).min(6, 'Password must be at least 6 characters'),
  }),
});

const loginValidationSchema = z.object({
  body: z.object({
    email: z.string({
      message: 'Email is required',
    }).email('Invalid email address'),
    password: z.string({
      message: 'Password is required',
    }),
  }),
});
const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      message: 'Refresh token is required!',
    }),
  }),
});
export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
  refreshTokenValidationSchema,

};