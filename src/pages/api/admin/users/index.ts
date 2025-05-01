import { NextApiResponse } from "next";
import { AuthenticatedRequest, withRole } from "../../middleware/auth";
import prisma from "@/lib/prisma";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const users = await prisma.user.findMany();
        return res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    } finally {
        await prisma.$disconnect();
    }
}

export default withRole(["ADMIN"])(handler);
