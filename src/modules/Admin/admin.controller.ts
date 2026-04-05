import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AdminService, } from "./admin.service";
import httpStatus from 'http-status';
import { prisma } from "../../lib/prisma";


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

// stats পাওয়ার জন্য একটা ফাংশন
const getAdminStats = async (req: Request, res: Response) => {
    try {
        const stats = await AdminService.getDashboardStatsFromDB();

        res.status(200).json({
            success: true,
            message: "Dashboard stats fetched successfully",
            data: stats,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard stats",
        });
    }
};

export const AdminController = {
    updateSettings,
    getSettings,
    getAdminStats,
};