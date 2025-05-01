import { NextApiResponse } from "next";
import { AuthenticatedRequest, withRole } from "../../middleware/auth";
import prisma from "@/lib/prisma";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method !== "PATCH") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { id } = req.query;

    const user = await prisma.user.findUnique({
        where: {
            id: id as string,
        },
    });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    try {
        const { role } = req.body;

        const updatedUser = await prisma.user.update({
            where: {
                id: id as string,
            },
            data: {
                role,
            },
        });

        return res.status(200).json(updatedUser);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export default withRole(["ADMIN"])(handler);
