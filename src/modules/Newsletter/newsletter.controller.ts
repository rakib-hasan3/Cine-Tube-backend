import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { NewsletterService } from './newsletter.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const subscribeNewsletter = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await NewsletterService.subscribeNewsletter(email);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Successfully subscribed to newsletter!',
        data: result,
    });
});

export const NewsletterController = {
    subscribeNewsletter,
};
