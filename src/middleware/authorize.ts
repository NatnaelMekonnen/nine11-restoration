import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import ResponseHandler from "./response";
import config from "../config/env.config";
import Account from "../models/Account";
import { AccountStatus, AccountType } from "../constants/enums";
import { IAccount } from "../models/interface";
import { AuthenticatedRequest } from "../types/type";

const { JWT_SECRET } = config;

const response = new ResponseHandler();

class Authorize {
  public async account(
    req: { account?: IAccount } & Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { headers } = req;
      let decoded: JwtPayload | string;
      if (headers && headers.authorization) {
        const parts = headers.authorization.split(" ");
        if (parts.length === 2) {
          const scheme = parts[0];
          const credentials = parts[1];
          if (/^Bearer$/i.test(scheme)) {
            const token = credentials;
            decoded = verify(token, JWT_SECRET);
            if (typeof decoded === "string") {
              return response.send(res, 400, {
                message: "Invalid token data",
              });
            }
            const account = await Account.findByIdAndUpdate(decoded?._id, {
              $inc: {
                totalNumberOfRequests: 1,
                numberOfRequestsCurrentMonth: 1,
              },
            });
            if (!account) {
              return response.send(res, 401, {
                message: "Account not found, Unauthorized",
              });
            }
            if (account.accountStatus !== AccountStatus.Active) {
              return response.send(res, 401, {
                message: `Account is ${account.accountStatus}, please contact support.`,
              });
            }
            (req as AuthenticatedRequest).account = account;
            return next();
          }
        } else {
          return response.send(res, 401, {
            message: "Invalid authorization format",
          });
        }
      } else {
        return response.send(res, 401, {
          message: "Authorization not found",
        });
      }
    } catch (error) {
      return response.send(res, 401, {
        message: "Token expired, you have to login.",
      });
    }
  }
  public async optional(
    req: Request & { account?: IAccount },
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const { headers } = req;
      let decoded: JwtPayload | string;
      if (headers && headers.authorization) {
        const parts = headers.authorization.split(" ");
        if (parts.length === 2) {
          const scheme = parts[0];
          const credentials = parts[1];
          if (/^Bearer$/i.test(scheme)) {
            const token = credentials;
            decoded = verify(token, JWT_SECRET);
            if (typeof decoded === "string") {
              return response.send(res, 400, {
                message: "Invalid token data",
              });
            }
            const account = await Account.findByIdAndUpdate(decoded?._id, {
              $inc: {
                totalNumberOfRequests: 1,
                numberOfRequestsCurrentMonth: 1,
              },
            });
            if (!account) {
              return next();
            }
            if (account.accountStatus !== AccountStatus.Active) {
              return next();
            }
            (req as AuthenticatedRequest).account = account;
            return next();
          }
        } else {
          return next();
        }
      } else {
        return next();
      }
    } catch (error) {
      return next();
    }
  }

  public async allowedAccountTypes(
    req: Request & { account?: IAccount | null },
    res: Response,
    next: NextFunction,
    accountTypes: (keyof typeof AccountType)[],
  ) {
    if (
      req.account?.accountType &&
      accountTypes.includes(req.account?.accountType)
    ) {
      return next();
    }

    return response.send(res, 403, {
      message: "Access denied!",
    });
  }
}

export default Authorize;
