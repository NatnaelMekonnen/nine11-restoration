import { NextFunction, Request, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import ResponseHandler from "./response";
import config from "../config/env.config";
import Account from "../models/Account";
import { IAccount } from "../types/models";
import { ACCOUNT_STATUS, USER_TYPE } from "../constants/enums";
import { ERRORS } from "../constants/errors";
import { AuthenticatedRequest } from "../models/main";
import Client from "../models/Client";
import moment from "moment";
const { JWT_SECRET } = config;

const response = new ResponseHandler();

class Authorize {
  public async account(
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
            if (decoded?.grantType !== "client") {
              let account: IAccount | null;
              account = await Account.findByIdAndUpdate(decoded?._id, {
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
              if (account.accountStatus !== ACCOUNT_STATUS.Active) {
                return response.send(res, 401, {
                  message: `Account is ${account.accountStatus}, please contact support.`,
                });
              }
              (req as AuthenticatedRequest).account = account;
              return next();
            } else {
              const client = await Client.findById(decoded?._id).populate(
                "account",
              );
              if (
                !client ||
                !client?.account ||
                typeof client?.account === "string"
              ) {
                return response.send(res, 401, {
                  message: "Account not found, Unauthorized",
                });
              }
              if (client.account?.accountStatus !== ACCOUNT_STATUS.Active) {
                return response.send(res, 401, {
                  message: `Account is ${client.account?.accountStatus}, please contact support.`,
                });
              }
              client.lastUsedAt = moment().toDate();
              await client.save();
              (req as AuthenticatedRequest).account = client.account;
              return next();
            }
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
  public async admin(
    req: Request & { account?: IAccount | null },
    res: Response,
    next: NextFunction,
    allowOther?: boolean,
  ) {
    if (req.account?.userType === USER_TYPE.Admin) {
      return next();
    }

    if (allowOther) {
      return next();
    }

    return response.send(res, 403, {
      message: "Access denied.",
      data: ERRORS.ACCOUNT.NOT_AUTHORIZED,
    });
  }
  public async customer(
    req: Request & { account?: IAccount | null },
    res: Response,
    next: NextFunction,
    allowOther?: boolean,
  ) {
    if (req.account?.userType === USER_TYPE.Customer) {
      return next();
    }

    if (allowOther) {
      return next();
    }

    return response.send(res, 403, {
      message: "Access denied.",
      data: ERRORS.ACCOUNT.NOT_AUTHORIZED,
    });
  }
  public async agent(
    req: Request & { account?: IAccount | null },
    res: Response,
    next: NextFunction,
    allowOther?: boolean,
  ) {
    if (req.account?.userType === USER_TYPE.Agent) {
      return next();
    }

    if (allowOther) {
      return next();
    }

    return response.send(res, 403, {
      message: "Access denied.",
      data: ERRORS.ACCOUNT.NOT_AUTHORIZED,
    });
  }
  public async business(
    req: Request & { account?: IAccount | null },
    res: Response,
    next: NextFunction,
    allowOther?: boolean,
  ) {
    if (req.account?.userType === USER_TYPE.Business) {
      return next();
    }

    if (allowOther) {
      return next();
    }

    return response.send(res, 403, {
      message: "Access denied.",
      data: ERRORS.ACCOUNT.NOT_AUTHORIZED,
    });
  }
  public async affiliate(
    req: Request & { account?: IAccount | null },
    res: Response,
    next: NextFunction,
    allowOther?: boolean,
  ) {
    if (req.account?.userType === USER_TYPE.Affiliate) {
      return next();
    }

    if (allowOther) {
      return next();
    }

    return response.send(res, 403, {
      message: "Access denied.",
      data: ERRORS.ACCOUNT.NOT_AUTHORIZED,
    });
  }
}

export default Authorize;
