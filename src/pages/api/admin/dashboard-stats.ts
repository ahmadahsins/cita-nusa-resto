import { NextApiResponse } from "next";
import { AuthenticatedRequest, withRole } from "../middleware/auth";
import prisma from "@/lib/prisma";
import { startOfDay, subDays, format } from "date-fns";

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
            include: {
                items: {
                    include: {
                        menu: true,
                    },
                },
                booking: {
                    include: {
                        user: true,
                        table: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        // Data untuk chart reservasi per hari (7 hari terakhir)
        const today = startOfDay(new Date());
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = subDays(today, 6 - i);
            return format(date, "yyyy-MM-dd");
        });

        const bookingsCount = await prisma.$queryRaw`
      SELECT 
        DATE("createdAt") as date, 
        COUNT(*) as count
      FROM 
        "Booking"
      WHERE 
        "createdAt" >= ${subDays(today, 6)}
      GROUP BY 
        DATE("createdAt")
      ORDER BY 
        date ASC
    `;

        // Mengisi hari tanpa reservasi dengan nilai 0
        const bookingsPerDay = last7Days.map((date) => {
            const found = bookingsCount.find(
                (b: any) => format(new Date(b.date), "yyyy-MM-dd") === date
            );
            return {
                date,
                count: found ? Number(found.count) : 0,
            };
        });

        // Data untuk chart pesanan per hari (7 hari terakhir)
        const ordersCount = await prisma.$queryRaw`
      SELECT 
        DATE("createdAt") as date, 
        COUNT(*) as count
      FROM 
        "Order"
      WHERE 
        "createdAt" >= ${subDays(today, 6)}
      GROUP BY 
        DATE("createdAt")
      ORDER BY 
        date ASC
    `;

        // Mengisi hari tanpa pesanan dengan nilai 0
        const ordersPerDay = last7Days.map((date) => {
            const found = ordersCount.find(
                (o: any) => format(new Date(o.date), "yyyy-MM-dd") === date
            );
            return {
                date,
                count: found ? Number(found.count) : 0,
            };
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
                bookingsPerDay,
                ordersPerDay,
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
