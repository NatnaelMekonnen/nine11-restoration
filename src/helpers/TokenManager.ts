import jwt from "jsonwebtoken";
import envConfig from "../config/env.config";
import { IAccount } from "../models/interface";
const { JWT_SECRET } = envConfig;

class TokenManager {
  generateToken(data: IAccount, expiresIn?: string | number): string {
    const token = jwt.sign(
      {
        _id: data._id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        accountType: data.accountType,
        accountStatus: data.accountStatus,
      },
      JWT_SECRET,
      { expiresIn: expiresIn || "7d" },
    );
    return token;
  }

  validateToken(token: string): boolean {
    try {
      jwt.verify(token, JWT_SECRET);
      return true;
    } catch (error) {
      return false;
    }
  }

  decodeToken(token: string): Record<string, unknown> | null {
    try {
      const decoded = jwt.decode(token);
      return decoded as Record<string, unknown>;
    } catch (error) {
      return null;
    }
  }
}

export default TokenManager;
