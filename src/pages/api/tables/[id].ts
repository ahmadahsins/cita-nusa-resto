import { NextApiResponse } from "next";
import { AuthenticatedRequest, withRole } from "../middleware/auth";
import prisma from "@/lib/prisma";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method === "GET") {
        try {
            const table = await prisma.table.findUnique({
                where: { id: id as string },
            });

            if (!table) {
                return res.status(404).json({ error: "Table not found" });
            }

            return res.status(200).json(table);
        } catch (error) {
            console.error("Error fetching table:", error);
            return res.status(500).json({ error: "Failed to fetch table" });
        }
    } else if (req.method === "PATCH") {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ error: "Forbidden" });
        }

        try {
            const { tableNumber, capacity, isAvailable } = req.body;

            const existingTable = await prisma.table.findUnique({
                where: { id: id as string },
            });

            if (!existingTable) {
                return res.status(404).json({ error: "Table not found" });
            }

            if (tableNumber !== existingTable.tableNumber) {
                const duplicateTable = await prisma.table.findFirst({
                    where: {
                        tableNumber: parseInt(tableNumber),
                        id: {
                            not: id as string,
                        },
                    },
                });

                if (duplicateTable) {
                    return res
                        .status(409)
                        .json({ error: "Table number already exists" });
                }
            }

            const updatedTable = await prisma.table.update({
                where: { id: id as string },
                data: { tableNumber, capacity, isAvailable },
            });

            return res.status(200).json(updatedTable);
        } catch (error) {
            console.error("Error updating table:", error);
            return res.status(500).json({ error: "Failed to update table" });
        }
    } else if (req.method === "DELETE") {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ error: "Forbidden" });
        }

        try {
            const existingTable = await prisma.table.findUnique({
                where: { id: id as string },
            });

            if (!existingTable) {
                return res.status(404).json({ error: "Table not found" });
            }

            const activeBookings = await prisma.booking.findMany({
                where: {
                    tableId: id as string,
                    status: {
                        in: ["PENDING", "CONFIRMED"],
                    },
                    dateTime: {
                        gte: new Date(),
                    },
                },
            });

            if (activeBookings.length > 0) {
                return res.status(409).json({
                    error: "Cannot delete table with active bookings",
                });
            }

            const deletedTable = await prisma.table.delete({
                where: { id: id as string },
            });

            return res.status(200).json(deletedTable);
        } catch (error) {
            console.error("Error deleting table:", error);
            return res.status(500).json({ error: "Failed to delete table" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}

// Tables can be viewed by all authenticated users
export default withRole(["ADMIN", "STAFF", "CUSTOMER"])(handler);
