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


const getDashboardStatsFromDB = async () => {
    const [totalMedia, totalUsers, activeUsers, recentMedia, revenueData] =
        await Promise.all([
            prisma.media.count({ where: { isDeleted: false } }),
            prisma.user.count(),
            prisma.user.count({ where: { status: "active" } }),

            prisma.media.findMany({
                take: 5,
                orderBy: { createdAt: "desc" },
                include: {
                    reviews: true,
                },
            }),

            // 🔥 REVENUE CALCULATION
            prisma.media.findMany({
                where: {
                    priceType: "PREMIUM",
                },
                select: {
                    price: true,
                },
            }),
        ]);

    // 💰 total revenue calculate
    const revenue = revenueData.reduce(
        (sum, item) => sum + (item.price || 0),
        0
    );

    return {
        totalMedia,
        totalUsers,
        activeUsers,

        // 🔥 FULLY DYNAMIC REVENUE
        revenue,

        recentMedia: recentMedia.map((item) => {
            const avgRating =
                item.reviews.length > 0
                    ? item.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) /
                    item.reviews.length
                    : 0;

            return {
                id: item.id,
                title: item.title,
                poster: item.posterUrl || "",
                genre: item.genre,
                year: item.releaseYear,
                status: "Published",
                performance: Math.round(avgRating * 20),
            };
        }),

        activities: [
            { message: `${totalMedia} media available`, time: "Now" },
            { message: `${activeUsers} users are active`, time: "Live" },
            { message: `Total revenue generated`, time: "Updated" },
        ],
    };
};
export const AdminService = {
    updateSettings,
    getSettings,
    getDashboardStatsFromDB,
};