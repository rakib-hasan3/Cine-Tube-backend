import httpStatus from 'http-status';
import bcrypt from 'bcrypt';
import config from '../../config';
import AppError from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { createToken, verifyToken } from './auth.utils';
import { TAuthUser, TLoginUser } from './auth.interface';
import sendResponse from '../../utils/sendResponse';

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
        data: {
            ...payload,
            password: hashedPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
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
        },
        accessToken,
        refreshToken
    };
};

const getMe = async (jwtPayload: TAuthUser) => {
    // সেফটি চেক: যদি jwtPayload-ই না থাকে
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
            createdAt: true,
            // এখানে avatar বা অন্য কিছু থাকলে যোগ করতে পারেন
        },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found in database!');
    }

    return user;
};
const refreshToken = async (token: string) => {
    // checking if the given token is valid
    const decoded = verifyToken(token, config.jwt_refresh_secret as string);

    const { email } = decoded;

    // checking if the user exists
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
    refreshToken,
    sendResponse
};