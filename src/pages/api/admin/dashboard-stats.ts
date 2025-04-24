import { NextApiResponse } from "next";
import { AuthenticatedRequest, withRole } from "../middleware/auth";
import prisma from "@/lib/prisma";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const totalUsers = await prisma.user.count();
        const totalBookings = await prisma.booking.count();
        const totalOrders = await prisma.order.count();
        const totalMenuItems = await prisma.menu.count();
        const totalTables = await prisma.table.count();
        const recentBookings = await prisma.booking.findMany({
            take: 5,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                user: true,
                table: true,
            },
        });
        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalBookings,
                totalOrders,
                totalMenuItems,
                totalTables,
                recentBookings,
                recentOrders,
            },
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    }
}

export default withRole(["ADMIN", "STAFF"])(handler);
