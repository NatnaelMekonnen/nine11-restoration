import { Request } from "express";
import { IAccount } from "../models/interface";

export interface IServiceReturn {
  success: boolean;
  status: number;
  message: string;
  data: unknown;
}
export interface AuthenticatedRequest extends Request {
  account: IAccount;
}
export interface OptionalAuthenticatedRequest extends Request {
  account?: IAccount;
}
