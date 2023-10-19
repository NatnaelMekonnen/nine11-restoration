import multer, { Multer, StorageEngine } from "multer";
import { Request, Response, NextFunction } from "express";
import { errorLogger } from "../utils/logger";

const storage: StorageEngine = multer.memoryStorage();
const upload: Multer = multer({ storage });

/**
 * Middleware for parsing multipart/form-data requests using Multer.
 * Handles file uploads and form fields.
 * @param req Express request object
 * @param res Express response object
 * @param next Express next middleware function
 */
export const multerParser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  upload.any()(req, res, (err: any) => {
    if (err) {
      errorLogger.log(err);
      return next(err);
    }
    next();
  });
};
