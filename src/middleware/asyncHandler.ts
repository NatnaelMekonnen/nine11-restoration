import { Response, NextFunction } from "express";
import { errorLogger } from "../utils/logger";
import errorHandler from "./errorHandler";

const asyncHandler = (
  fn: (
    req: any,
    res: Response,
    next: NextFunction,
  ) => Promise<any>,
) => {
  return async (
    req: any,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      errorLogger.log(error);
      errorHandler(error, req, res);
    }
  };
};

export default asyncHandler;
