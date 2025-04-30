import { NextApiResponse } from "next";
import { AuthenticatedRequest, withRole } from "../middleware/auth";
import prisma from "@/lib/prisma";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    const { id } = req.query;

    if (req.method === "GET") {
        try {
            const menu = await prisma.menu.findUnique({
                where: { id: id as string },
            });

            if (!menu) {
                return res.status(404).json({ error: "Menu not found" });
            }

            return res.status(200).json(menu);
        } catch (error) {
            console.error("Error fetching menu:", error);
            return res.status(500).json({ error: "Failed to fetch menu" });
        }
    } else if (req.method === "PATCH") {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ error: "Forbidden" });
        }

        try {
            const { name, description, price, image, isAvailable, categoryId } =
                req.body;

            const existingMenu = await prisma.menu.findUnique({
                where: { id: id as string },
            });

            if (!existingMenu) {
                return res.status(404).json({ error: "Menu not found" });
            }

            const existingCategory = await prisma.menuCategory.findUnique({
                where: { id: categoryId as string },
            });

            if (!existingCategory) {
                return res.status(404).json({ error: "Category not found" });
            }

            if (price !== undefined && Number(price) <= 0) {
                return res
                    .status(400)
                    .json({ error: "Price must be greater than 0" });
            }

            const updatedMenu = await prisma.menu.update({
                where: { id: id as string },
                data: {
                    name,
                    description: description || existingMenu.description,
                    price: Number(price) || existingMenu.price,
                    image: image || existingMenu.image,
                    isAvailable: isAvailable || existingMenu.isAvailable,
                },
                include: {
                    category: true,
                },
            });

            return res.status(200).json(updatedMenu);
        } catch (error) {
            console.error("Error updating menu:", error);
            return res.status(500).json({ error: "Failed to update menu" });
        } finally {
            await prisma.$disconnect();
        }
    } else if (req.method === "DELETE") {
        if (req.user.role !== "ADMIN") {
            return res.status(403).json({ error: "Forbidden" });
        }

        try {
            const existingMenu = await prisma.menu.findUnique({
                where: { id: id as string },
            });

            if (!existingMenu) {
                return res.status(404).json({ error: "Menu not found" });
            }

            const orderItems = await prisma.orderItem.findFirst({
                where: { menuId: id as string },
            });

            if (orderItems) {
                const updatedMenu = await prisma.menu.update({
                    where: { id: id as string },
                    data: {
                        isAvailable: false,
                    },
                });

                return res.status(200).json(updatedMenu);
            }

            const deleledMenu = await prisma.menu.delete({
                where: { id: id as string },
            });

            return res.status(200).json(deleledMenu);
        } catch (error) {
            console.error("Error deleting menu:", error);
            return res.status(500).json({ error: "Failed to delete menu" });
        } finally {
            await prisma.$disconnect();
        }
    }
}

export default withRole(["ADMIN", "STAFF", "CUSTOMER"])(handler);
