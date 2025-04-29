import prisma from "@/lib/prisma";
import { NextApiResponse } from "next";
import { AuthenticatedRequest, withRole } from "../middleware/auth";
import { BookingStatus } from "@prisma/client";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const { date, status, userId } = req.query;

            const where = {} as {
                dateTime?: {
                    gte?: Date;
                    lte?: Date;
                };
                status?: BookingStatus;
                userId?: string;
            };

            if (date) {
                const startDate = new Date(date as string);
                startDate.setHours(0, 0, 0, 0);
                const endDate = new Date(date as string);
                endDate.setHours(23, 59, 59, 999);

                where.dateTime = { gte: startDate, lte: endDate };
            }

            if (status) {
                where.status = status as BookingStatus;
            }

            if (req.user.role === "CUSTOMER") {
                where.userId = req.user.id;
            } else if (
                userId &&
                (req.user.role === "ADMIN" || req.user.role === "STAFF")
            ) {
                where.userId = userId as string;
            }

            const bookings = await prisma.booking.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                        },
                    },
                    table: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return res.status(200).json({ success: true, data: bookings });
        } catch (error) {
            console.error("Error fetching bookings:", error);
            return res.status(500).json({ error: "Failed to fetch bookings" });
        }
    } else if (req.method === "POST") {
        try {
            const {
                tableId,
                dateTime,
                duration = 120,
                guestCount,
                specialRequest,
            } = req.body;

            const bookingDateTime = new Date(dateTime);

            // Check if the table is available at the requested time
            const existingTable = await prisma.booking.findMany({
                where: {
                    tableId,
                    dateTime: {
                        // Check for overlap with existing bookings
                        // A table is unavailable if there's a booking that:
                        // 1. Starts before the requested booking ends
                        // 2. Ends after the requested booking starts
                        lte: new Date(
                            bookingDateTime.getTime() + duration * 60 * 1000
                        ),
                    },
                    AND: {
                        dateTime: {
                            gte: new Date(
                                bookingDateTime.getTime() - duration * 60 * 1000
                            ),
                        },
                    },
                    status: {
                        in: ["PENDING", "CONFIRMED"],
                    },
                },
            });

            if (existingTable.length > 0) {
                return res.status(400).json({
                    error: "Table is not available at the requested time",
                });
            }

            const table = await prisma.table.findUnique({
                where: { id: tableId },
            });

            if (!table) {
                return res.status(400).json({
                    error: "Table not found",
                });
            }

            if (table.capacity < guestCount) {
                return res.status(400).json({
                    error: "Guest count exceeds table capacity",
                });
            }

            // Create the booking
            const booking = await prisma.booking.create({
                data: {
                    userId: req.user.id,
                    tableId,
                    dateTime: bookingDateTime,
                    duration,
                    guestCount,
                    specialRequest,
                    status: "PENDING",
                },
            });

            return res.status(201).json({ success: true, data: booking });
        } catch (error) {
            console.error("Error creating booking:", error);
            return res.status(500).json({ error: "Failed to create booking" });
        }
    } else {
        return res.status(403).json({ error: "Method not allowed" });
    }
}

// Customers can create bookings, admins and staff can view all bookings
export default withRole(["ADMIN", "STAFF", "CUSTOMER"])(handler);
