import prisma from "@/lib/prisma";
import { NextApiResponse } from "next";
import { AuthenticatedRequest, withRole } from "../middleware/auth";
import { BookingStatus } from "@prisma/client";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    const { id } = req.query;

    const booking = await prisma.booking.findUnique({
        where: { id: id as string },
        include: {
            user: true,
            table: true,
        },
    });

    if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
    }

    if (req.user.role === "CUSTOMER" && req.user.id !== booking.userId) {
        return res.status(403).json({ error: "Unauthorized access" });
    }

    if (req.method === "GET") {
        try {
            const booking = await prisma.booking.findUnique({
                where: { id: id as string },
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
                    orders: true,
                },
            });
            return res.status(200).json(booking);
        } catch (error) {
            console.error("Error fetching booking:", error);
            return res.status(500).json({ error: "Failed to fetch booking" });
        }
    } else if (req.method === "PATCH") {
        try {
            const {
                status,
                dateTime,
                tableId,
                guestCount,
                specialRequest,
                duration,
            } = req.body;

            // Only allow admins and staff to update status
            if (status && req.user.role === "CUSTOMER") {
                return res
                    .status(403)
                    .json({ error: "Customers cannot change booking status" });
            }

            // If updating dateTime or tableId, check availability
            if (
                (dateTime || tableId) &&
                (req.user.role === "ADMIN" ||
                    req.user.role === "STAFF" ||
                    req.user.id === booking.userId)
            ) {
                const bookingDateTime = dateTime
                    ? new Date(dateTime)
                    : booking.dateTime;
                const targetTableId = tableId || booking.tableId;
                const bookingDuration = duration || booking.duration;

                // Check if the table is available at the requested time (excluding current booking)
                const existingBookings = await prisma.booking.findMany({
                    where: {
                        id: { not: id as string }, // Exclude current booking
                        tableId: targetTableId,
                        dateTime: {
                            lte: new Date(
                                bookingDateTime.getTime() +
                                    bookingDuration * 60 * 1000
                            ),
                        },
                        AND: {
                            dateTime: {
                                gte: new Date(
                                    bookingDateTime.getTime() -
                                        bookingDuration * 60 * 1000
                                ),
                            },
                        },
                        status: {
                            in: ["PENDING", "CONFIRMED"],
                        },
                    },
                });

                if (existingBookings.length > 0) {
                    return res.status(409).json({
                        error: "Table is not available at the requested time",
                    });
                }

                // If changing table, check capacity
                if (tableId && guestCount) {
                    const table = await prisma.table.findUnique({
                        where: { id: tableId },
                    });

                    if (!table) {
                        return res
                            .status(404)
                            .json({ error: "Table not found" });
                    }

                    if (table.capacity < guestCount) {
                        return res.status(400).json({
                            error: "Table capacity is not sufficient for the guest count",
                        });
                    }
                }
            }

            // Prepare update data
            const updateData: {
                status?: BookingStatus;
                dateTime?: Date;
                tableId?: string;
                guestCount?: number;
                specialRequest?: string;
                duration?: number;
            } = {};

            if (
                status &&
                (req.user.role === "ADMIN" || req.user.role === "STAFF")
            ) {
                updateData.status = status;
            }

            if (dateTime) updateData.dateTime = new Date(dateTime);
            if (tableId) updateData.tableId = tableId;
            if (guestCount) updateData.guestCount = guestCount;
            if (specialRequest !== undefined)
                updateData.specialRequest = specialRequest;
            if (duration) updateData.duration = duration;

            // Update the booking
            const updatedBooking = await prisma.booking.update({
                where: { id: id as string },
                data: updateData,
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
            });

            return res.status(200).json(updatedBooking);
        } catch (error) {
            console.error("Error updating booking:", error);
            return res.status(500).json({ error: "Failed to update booking" });
        }
    } else if (req.method === "DELETE") {
        try {
            // Only allow admins, staff, or the booking owner to cancel
            if (
                req.user.role !== "ADMIN" &&
                req.user.role !== "STAFF" &&
                req.user.id !== booking.userId
            ) {
                return res.status(403).json({
                    error: "Forbidden",
                });
            }

            // delete the booking
            const deletedBooking = await prisma.booking.update({
                where: {
                    id: id as string,
                },
                data: {
                    status: "CANCELLED",
                },
            });
            return res.status(200).json(deletedBooking);
        } catch (error) {
            console.error("Error cancelling booking:", error);
            return res.status(500).json({ error: "Failed to cancel booking" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}

// Customers can access their own bookings, admins and staff can access all
export default withRole(["ADMIN", "STAFF", "CUSTOMER"])(handler);
