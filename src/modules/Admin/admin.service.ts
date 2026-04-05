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
    // ১. সব ডাটা ডাটাবেস থেকে কাউন্ট করা
    const [totalMedia, totalUsers, activeUsers, recentMedia] = await Promise.all([
        prisma.media.count(), // আপনার মিডিয়া টেবিলের নাম অনুযায়ী দিবেন
        prisma.user.count(),
        prisma.user.count({ where: { status: "active" } }),
        prisma.media.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
        }),
    ]);

    // ২. আপনার ড্যাশবোর্ডের ফরম্যাট অনুযায়ী ডাটা রিটার্ন করা
    return {
        totalMedia: totalMedia.toLocaleString(),
        activeUsers: activeUsers.toLocaleString(),
        revenue: "12,450", // যদি পেমেন্ট গেটওয়ে না থাকে তবে স্ট্যাটিক রাখুন
        mediaTrend: "12",  // এগুলো ক্যালকুলেট করা যায়, আপাতত স্ট্যাটিক দিতে পারেন
        userTrend: "18",
        revenueTrend: "5",
        recentMedia: recentMedia.map((item) => ({
            id: item.id,
            title: item.title,
            poster: item.posterUrl || "",
            genre: item.genre || "N/A",
            year: item.createdAt || "N/A",
            status: "Published",
            performance: 80, // আপাতত ডামি পারফরম্যান্স
        })),
        activities: [
            { message: "New media content added", time: "Just now" },
            { message: `${activeUsers} users are currently active`, time: "Live" },
        ],
    };
};
export const AdminService = {
    updateSettings,
    getSettings,
    getDashboardStatsFromDB,
};