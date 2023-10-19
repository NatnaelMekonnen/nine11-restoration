import jwt from "jsonwebtoken";
import envConfig from "../config/env.config";
import { IAccount, IClient } from "../types/models";
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
        userType: data.userType,
        googleId: data.googleId,
        accountStatus: data.accountStatus,
        roles: data.roles,
        subscriptionPlan: data.subscriptionPlan,
      },
      JWT_SECRET,
      { expiresIn: expiresIn || "7d" },
    );
    return token;
  }

  generateClientToken(data: IClient, expiresIn?: string | number): string {
    const token = jwt.sign(
      {
        _id: data._id,
        account: data.account,
        clientId: data.clientId,
        grantType: "client",
      },
      JWT_SECRET,
      { expiresIn: expiresIn || "1hr" },
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

  decodeToken(token: string): Record<string, any> | null {
    try {
      const decoded = jwt.decode(token);
      return decoded as Record<string, any>;
    } catch (error) {
      return null;
    }
  }
}

export default TokenManager;
