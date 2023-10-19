import { Response } from "express";
import { errorLogger, successLogger, warnLogger } from "../utils/logger";

interface IResponseData {
  message?: string;
  data?: unknown | object | null;
  error?: unknown | object | null;
  statusText?: string;
}

export interface IResponse {
  send(res: Response, status: number, data?: IResponseData): Response;
}

class ResponseHandler implements IResponse {
  send(res: Response, status: number, data?: IResponseData): Response {
    if (status === 200) {
      successLogger.log(data?.message);
    } else if (status >= 400 && status < 500) {
      warnLogger.log(data);
    } else if (status === 500) {
      errorLogger.log(data);
    }
    return res.status(status).json(data);
  }
  redirect(res: Response, status: number, redirect: string): void {
    return res.status(status).redirect(redirect);
  }
}

export default ResponseHandler;
