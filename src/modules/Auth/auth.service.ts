import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import config from '../../config';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { createToken, verifyToken } from './auth.utils';
import { TAuthUser, TLoginUser } from './auth.interface';

const registerUser = async (payload: any) => {
    const isExistUser = await prisma.user.findUnique({
        where: { email: payload.email },
    });

    if (isExistUser) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(
        payload.password,
        Number(config.bcrypt_salt_rounds || 12)
    );

    const newUser = await prisma.user.create({
        // @ts-ignore
        data: {
            ...payload,
            password: hashedPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            subscription: true, // ✅ নতুন যোগ করা হলো
            createdAt: true,
        },
    });

    return newUser;
};

const loginUser = async (payload: TLoginUser) => {
    const user = await prisma.user.findUnique({
        where: { email: payload.email },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    const isPasswordMatched = await bcrypt.compare(
        payload.password as string,
        user.password
    );

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid password');
    }

    const jwtPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string || '7d'
    );
    const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string || '30d'
    );

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            subscription: user.subscription, // ✅ এখন লগইন করার সাথে সাথেই ফ্রন্টএন্ড স্ট্যাটাস পাবে
        },
        accessToken,
        refreshToken
    };
};

const getMe = async (jwtPayload: TAuthUser) => {
    if (!jwtPayload || !jwtPayload.email) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token payload!');
    }

    const user = await prisma.user.findUnique({
        where: {
            email: jwtPayload.email,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            subscription: true,    // ✅ ফ্রন্টএন্ড বাটন সবুজ করার জন্য এটিই প্রধান ভূমিকা রাখবে
            planExpiresAt: true,   // ✅ এক্সপায়ারি ডেটও পাঠিয়ে দিচ্ছি
            createdAt: true,
        },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found in database!');
    }

    return user;
};

const refreshToken = async (token: string) => {
    const decoded = verifyToken(token, config.jwt_refresh_secret as string);
    const { email } = decoded;

    const user = await prisma.user.findUnique({
        where: { email: email },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
    }

    const jwtPayload = {
        email: user.email,
        role: user.role,
        id: user.id
    };

    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    );

    return {
        accessToken,
    };
};

export const AuthService = {
    registerUser,
    loginUser,
    getMe,
    refreshToken
};