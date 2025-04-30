import prisma from "@/lib/prisma";
import { NextApiResponse } from "next";
import { AuthenticatedRequest, withRole } from "../middleware/auth";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    if (req.method === "GET") {
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
    } else if (req.method === "POST") {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ message: "Forbidden" });
        }

        try {
            const { name, description, price, image, isAvailable, categoryId } =
                req.body;

            if (!name || !price || !categoryId) {
                return res.status(400).json({ message: "Bad Request" });
            }

            if (price <= 0) {
                return res
                    .status(400)
                    .json({ message: "Price must be greater than 0" });
            }

            const category = await prisma.menuCategory.findUnique({
                where: {
                    id: categoryId,
                },
            });

            if (!category) {
                return res.status(404).json({ message: "Category not found" });
            }

            const newMenu = await prisma.menu.create({
                data: {
                    name,
                    price,
                    categoryId,
                    description: description || "",
                    image: image || "",
                    isAvailable: isAvailable || true,
                },
                include: {
                    category: true,
                },
            });

            return res.status(201).json({ success: true, data: newMenu });
        } catch (error) {
            console.error("Error creating menu:", error);
            return res.status(500).json({ success: false, message: "Error" });
        }
    } else {
        return res.status(405).json({ message: "Method Not Allowed" });
    }
}

export default withRole(["ADMIN", "STAFF", "CUSTOMER"])(handler);
