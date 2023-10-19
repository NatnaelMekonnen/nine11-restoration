import { ClassConstructor, plainToInstance } from "class-transformer";
import { ValidationError, validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import ResponseHandler from "./response";
import { AuthenticatedRequest } from "../types/type";

const response = new ResponseHandler();

export const validateRequest = async <T>(
  dto: ClassConstructor<T>,
  data: Record<string, unknown>,
): Promise<{ error?: ValidationError[]; data?: T }> => {
  const requestDTO = plainToInstance(dto, data);
  const errors = await validate(requestDTO as object);

  if (errors.length > 0) {
    return {
      error: errors,
    };
  }
  return {
    data: requestDTO,
  };
};

export const expressValidate = (
  req: Request | AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error: Record<string, string> = {};
    errors.array().forEach((err) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const customError: any = err;
      error[customError.path] = err.msg;
    });

    return response.send(res, 400, {
      message: "Request validation failed",
      data: error,
    });
  }

  next();
};
