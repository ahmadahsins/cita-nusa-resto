import prisma from "@/lib/prisma";
import { Item } from "@/pages/admin/orders/add";
import { NextApiRequest, NextApiResponse } from "next";
import { withRole } from "../middleware/auth";

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const orders = await prisma.order.findMany({
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
            });

            return res.status(200).json({ success: true, data: orders });
        } catch (error) {
            console.error("Error fetching orders:", error);
            return res
                .status(500)
                .json({ success: false, message: "Internal Server Error" });
        }
    } else if (req.method === "POST") {
        try {
            const { bookingId, items } = req.body;

            if (!bookingId || !items) {
                return res
                    .status(400)
                    .json({ message: "Missing required fields" });
            }

            const booking = await prisma.booking.findUnique({
                where: {
                    id: bookingId,
                },
            });

            if (!booking) {
                return res.status(404).json({ message: "Booking not found" });
            }

            if (booking.status !== "CONFIRMED") {
                return res
                    .status(400)
                    .json({ message: "Booking is not confirmed yet" });
            }

            const order = await prisma.$transaction(async (tx) => {
                const newOrder = await tx.order.create({
                    data: {
                        bookingId: bookingId,
                        status: "PENDING",
                    },
                });

                const orderItems = await Promise.all(
                    items.map(async (item: Item) => {
                        const menu = await tx.menu.findUnique({
                            where: {
                                id: item.menuId,
                            },
                        });

                        if (!menu) {
                            throw new Error("Menu not found");
                        }

                        return tx.orderItem.create({
                            data: {
                                orderId: newOrder.id,
                                menuId: menu.id,
                                quantity: item.quantity,
                                notes: item.notes,
                            },
                        });
                    })
                );

                return {
                    ...newOrder,
                    items: orderItems,
                };
            });

            return res.status(201).json({ success: true, data: order });
        } catch (error) {
            console.error("Error creating order:", error);
            return res.status(500).json({
                message: "Terjadi kesalahan server",
                error: (error as Error).message,
            });
        }
    }
}

export default withRole(["ADMIN", "STAFF"])(handler);
