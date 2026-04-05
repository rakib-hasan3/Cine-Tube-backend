import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { prisma } from '../lib/prisma';
import catchAsync from '../utils/catchAsync';

const auth = (...requiredRoles: string[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        let token;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        } else if (authHeader) {
            token = authHeader;
        }

        if (!token) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
        }

        // ✅ safer verify
        let decoded: JwtPayload;

        try {
            decoded = jwt.verify(
                token,
                config.jwt_access_secret as string
            ) as JwtPayload;
        } catch (err) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token!');
        }

        // ✅ EXTRA SAFETY
        if (!decoded || !decoded.email) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token payload!');
        }

        console.log("DECODED 👉", decoded);

        const { role, email } = decoded;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'This user is not found!');
        }

        if (
            requiredRoles &&
            requiredRoles.length > 0 &&
            !requiredRoles.includes(role)
        ) {
            throw new AppError(
                httpStatus.FORBIDDEN,
                'You do not have permission to access this route'
            );
        }

        // 🔥 MOST IMPORTANT
        req.user = decoded;

        next();
    });
};
export default auth;
