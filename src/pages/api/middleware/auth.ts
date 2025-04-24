import { verifyToken } from "@/lib/jwt";
import { Role } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export interface UserData {
    id: string;
    email: string;
    role: Role;
}

export interface AuthenticatedRequest extends NextApiRequest {
    user: UserData;
}

export function withAuth(
    handler: (
        req: AuthenticatedRequest,
        res: NextApiResponse
    ) => Promise<void> | void
) {
    return async (req: AuthenticatedRequest, res: NextApiResponse) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const token = authHeader.split(" ")[1];
            const decoded = verifyToken(token);

            if (!decoded) {
                return res.status(401).json({ message: "Invalid token" });
            }

            req.user = decoded as UserData;
            return handler(req, res);
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: "Unauthorized" });
        }
    };
}

export function withRole(roles: string[]) {
    return (
        handler: (
            req: AuthenticatedRequest,
            res: NextApiResponse
        ) => Promise<void> | void
    ) => {
        return withAuth(async (req, res) => {
            if (!req.user || !roles.includes(req.user.role)) {
                return res.status(403).json({ message: "Forbidden" });
            }

            return handler(req, res);
        });
    };
}
