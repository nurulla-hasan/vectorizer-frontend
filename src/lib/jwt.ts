import jwt, { type JwtPayload } from "jsonwebtoken";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

export const jwtUtils = {
  verifyToken<T extends JwtPayload = JwtPayload>(token?: string): T | null {
    if (!token || !JWT_ACCESS_SECRET) return null;

    try {
      return jwt.verify(token, JWT_ACCESS_SECRET) as T;
    } catch {
      return null;
    }
  },

  decodeToken<T extends JwtPayload = JwtPayload>(token?: string): T | null {
    if (!token) return null;

    try {
      return jwt.decode(token) as T | null;
    } catch {
      return null;
    }
  },
};
