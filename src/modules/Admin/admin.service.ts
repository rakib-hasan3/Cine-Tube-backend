import { prisma } from "../../lib/prisma";

const updateSettings = async (payload: any) => {
    const result = await prisma.systemSetting.upsert({
        where: { id: "config" },
        update: payload,
        create: { id: "config", ...payload },
    });
    return result;
};

const getSettings = async () => {
    // আমরা ধরে নিচ্ছি ডাটাবেসে একটাই কনফিগ রো থাকবে যার ID হবে "config"
    const settings = await prisma.systemSetting.findUnique({
        where: { id: 'config' },
    });

    // যদি ডাটাবেসে কোনো সেটিংস না থাকে, তবে একটা ডিফল্ট রিটার্ন করবে
    if (!settings) {
        return {
            siteName: 'CineTube',
            maintenanceMode: false,
            allowRegistration: true,
        };
    }

    return settings;
};

export const AdminService = {
    updateSettings,
    getSettings
};