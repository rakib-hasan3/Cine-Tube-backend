import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminService } from "./admin.service";
import httpStatus from 'http-status';


const updateSettings = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.updateSettings(req.body);
    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Settings updated!',
        data: result,
    });
});

const getSettings = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getSettings();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'System settings retrieved successfully',
        data: result,
    });
});

export const AdminController = {
    updateSettings,
    getSettings
};