import { Types } from "mongoose";
import { IAccount, IStaff } from "../models/interface";
import { IsEnum, IsMongoId, IsNotEmpty, IsOptional } from "class-validator";
import { StaffRole } from "../constants/enums";

export class CreateStaffDTO implements Partial<IStaff> {
  @IsNotEmpty()
  @IsMongoId()
  staff!: string | IAccount | Types.ObjectId;

  @IsNotEmpty()
  @IsEnum(StaffRole)
  role!: keyof typeof StaffRole;
}

export class UpdateStaffDTO implements Partial<IStaff> {
  @IsOptional()
  @IsMongoId()
  staff!: string | IAccount | Types.ObjectId;

  @IsOptional()
  @IsEnum(StaffRole)
  role!: keyof typeof StaffRole;
}
