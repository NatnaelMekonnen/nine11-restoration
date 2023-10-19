/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response, NextFunction, Request } from "express";
import { errorLogger } from "../utils/logger";
import errorHandler from "./errorHandler";

const asyncHandler = <T>(
  fn: (
    req: any,
    res: Response,
    next: NextFunction,
  ) => Promise<Response>,
) => {
  return async (req: T, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      errorLogger.log(error);
      errorHandler(error, req as Request, res);
    }
  };
};

export default asyncHandler;
