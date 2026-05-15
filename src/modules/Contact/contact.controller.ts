import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { ContactService } from './contact.service';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

const sendContactEmail = catchAsync(async (req: Request, res: Response) => {
    console.log('Incoming Contact Request Body:', req.body);
    const result = await ContactService.sendContactEmail(req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Message sent successfully!',
        data: result,
    });
});

export const ContactController = {
    sendContactEmail,
};
