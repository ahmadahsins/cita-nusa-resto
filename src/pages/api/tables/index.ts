import prisma from "@/lib/prisma";
import { NextApiResponse } from "next";
import { AuthenticatedRequest, withRole } from "../middleware/auth";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const tables = await prisma.table.findMany({
                orderBy: {
                    tableNumber: "asc",
                },
            });

            return res.status(200).json(tables);
        } catch (error) {
            console.error("Error fetching tables:", error);
            return res.status(500).json({ error: "Failed to fetch tables" });
        }
    } else if (req.method === "POST") {
        try {
            if (req.user.role !== "ADMIN") {
                return res.status(403).json({ error: "Forbidden" });
            }

            const { tableNumber, capacity, isAvailable = true } = req.body;

            const existingTable = await prisma.table.findFirst({
                where: { tableNumber: parseInt(tableNumber) },
            });

            if (existingTable) {
                return res.status(400).json({ error: "Table already exists" });
            }

            const table = await prisma.table.create({
                data: {
                    tableNumber: parseInt(tableNumber),
                    capacity: parseInt(capacity),
                    isAvailable,
                },
            });

            return res.status(201).json(table);
        } catch (error) {
            console.error("Error creating table:", error);
            return res.status(500).json({ error: "Failed to create table" });
        }
    }
}

// Tables can be viewed by all authenticated users
export default withRole(["ADMIN", "STAFF", "CUSTOMER"])(handler);
