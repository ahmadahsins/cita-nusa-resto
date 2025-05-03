import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(payload: {
    id: string;
    email: string;
    role: string;
}) {
    return jwt.sign(payload, JWT_SECRET!, { expiresIn: "1d" });
}

export function verifyToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET!);
    } catch (error) {
        console.log(error);
        return null;
    }
}

export function getTokenExpiration(token: string): number | null {
    try {
        const decoded = jwt.decode(token) as { exp: number };
        return decoded.exp;
    } catch (error) {
        console.log(error);
        return null;
    }
}
