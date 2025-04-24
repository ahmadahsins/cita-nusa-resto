import prisma from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const menus = await prisma.menu.findMany({
            include: {
                category: true,
            },
            orderBy: {
                category: {
                    name: "asc",
                },
            },
        });

        return res.status(200).json({ success: true, data: menus });
    } catch (error) {
        console.error("Error fetching menus:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    } finally {
        await prisma.$disconnect();
    }
}
