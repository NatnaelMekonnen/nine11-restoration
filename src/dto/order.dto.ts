import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
} from "class-validator";
import { IAccount, IOrder } from "../models/interface";
import { Types } from "mongoose";

export class CreateOrderDTO implements Partial<IOrder> {
  @IsNotEmpty()
  @IsMongoId()
  requestId: string = "";

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  cost: number = 0;

  @IsNotEmpty()
  @IsMongoId()
  assignedAgent?: string | Types.ObjectId | IAccount | undefined;
}

export class UpdateOrderDTO implements Partial<IOrder> {
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost: number = 0;

  @IsOptional()
  @IsMongoId()
  assignedAgent?: string | Types.ObjectId | IAccount | undefined;
}
