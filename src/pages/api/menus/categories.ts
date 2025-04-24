import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const categories = await prisma.menuCategory.findMany({
            orderBy: {
                name: "asc",
            },
        });

        return res.status(200).json({ success: true, data: categories });
    } catch (error) {
        console.error("Error fetching menus:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    } finally {
        await prisma.$disconnect();
    }
}
