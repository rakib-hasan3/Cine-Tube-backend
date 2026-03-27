import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import AppError from '../errors/AppError';
import catchAsync from '../utils/catchAsync';

const role = (...requiredRoles: string[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { role } = req.user;

        if (requiredRoles && !requiredRoles.includes(role as string)) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
        }

        next();
    });
};

export default role;
