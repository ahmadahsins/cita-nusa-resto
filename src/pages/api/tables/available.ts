import { NextApiResponse } from "next";
import { AuthenticatedRequest, withRole } from "../middleware/auth";
import prisma from "@/lib/prisma";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const { date, time, guestCount } = req.query;

        // Parse date and time to create a DateTime object
        const [year, month, day] = (date as string).split("-").map(Number);
        const [hour, minute] = (time as string).split(":").map(Number);

        const dateTime = new Date(year, month - 1, day, hour, minute);

        // Default duration (2 hours)
        const duration = 120;

        // Find bookings that overlap with the requested time
        const bookings = await prisma.booking.findMany({
            where: {
                dateTime: {
                    // Bookings that start before the requested time ends
                    lte: new Date(dateTime.getTime() + duration * 60 * 1000),
                },
                AND: {
                    dateTime: {
                        // Bookings that end after the requested time starts
                        gte: new Date(
                            dateTime.getTime() - duration * 60 * 1000
                        ),
                    },
                },
                status: {
                    in: ["PENDING", "CONFIRMED"],
                },
            },
            select: {
                tableId: true,
            },
        });

        const bookingTableIds = bookings.map((booking) => booking.tableId);

        const availableTables = await prisma.table.findMany({
            where: {
                id: {
                    notIn: bookingTableIds,
                },
                isAvailable: true,
                ...(guestCount
                    ? { capacity: { gte: parseInt(guestCount as string) } }
                    : {}),
            },
            orderBy: {
                capacity: "asc",
            },
        });

        return res.status(200).json({ success: true, data: availableTables });
    } catch (error) {
        console.error("Error finding available tables:", error);
        return res
            .status(500)
            .json({ error: "Failed to find available tables" });
    }
}

export default withRole(["ADMIN", "STAFF", "CUSTOMER"])(handler);
