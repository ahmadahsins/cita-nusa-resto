import prisma from "@/lib/prisma";
import { NextApiResponse } from "next";
import { AuthenticatedRequest, withRole } from "../middleware/auth";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    const { id } = req.query;

    const order = await prisma.order.findUnique({
        where: {
            id: id as string,
        },
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

    if (!order) {
        return res.status(404).json({
            success: false,
            message: "Order not found",
        });
    }

    if (req.user.role === "CUSTOMER" && req.user.id !== order.booking.userId) {
        return res.status(403).json({
            success: false,
            message: "Unauthorized",
        });
    }

    if (req.method === "GET") {
        try {
            return res.status(200).json({ success: true, data: order });
        } catch (error) {
            console.error("Error fetching orders:", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    } else if (req.method === "PATCH") {
        try {
            const { status } = req.body;

            if (req.user.role === "CUSTOMER") {
                return res.status(403).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            const updatedOrder = await prisma.order.update({
                where: {
                    id: id as string,
                },
                data: {
                    status,
                },
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

            return res.status(200).json({
                success: true,
                data: updatedOrder,
            });
        } catch (error) {
            console.error("Error updating order status:", error);
            return res.status(500).json({
                success: false,
                message: "Internal Server Error",
            });
        }
    }
}

export default withRole(["ADMIN", "STAFF", "CUSTOMER"])(handler);
