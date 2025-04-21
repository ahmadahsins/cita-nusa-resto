import { PrismaClient } from "@prisma/client";
import { NextApiResponse } from "next";
import { AuthenticatedRequest, withAuth } from "../middleware/auth";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
    // Cek jenis request (GET, PATCH, dll)
    if (req.method === "GET") {
        try {
            // Ambil data user dari database berdasarkan ID yang ada di token
            const user = await prisma.user.findUnique({
                where: { id: req.user?.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    // Pilih field yang ingin ditampilkan
                },
            });

            if (!user) {
                return res
                    .status(404)
                    .json({ message: "User tidak ditemukan" });
            }

            return res.status(200).json({ user });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    } else if (req.method === "PATCH") {
        try {
            const { name, email, phone } = req.body;

            // Update data user
            const updatedUser = await prisma.user.update({
                where: { id: req.user?.id },
                data: {
                    name,
                    email,
                    phone,
                },
            });

            return res.status(200).json({
                message: "Profil berhasil diperbarui",
                user: updatedUser,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    } else {
        return res.status(405).json({ message: "Method not allowed" });
    }
}

export default withAuth(handler);
