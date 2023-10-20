import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { AccountType } from "../constants/enums";
import { IAccount } from "../models/interface";

export class CreateAccountDTO implements Partial<IAccount> {
  @IsString()
  @IsNotEmpty()
  @IsEnum(AccountType)
  accountType: "Admin" | "Staff" | "Customer" = "Customer";

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string = "";

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  firstName: string = "";

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  lastName: string = "";

  @IsOptional()
  @MinLength(10)
  @MaxLength(14)
  phone?: string | undefined;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string | undefined;

  @IsEmpty()
  accountStatus?: "Active" | "Inactive" | "Suspended" | "Deleted" | undefined;
}

export class UpdateAccountDTO implements Partial<IAccount> {
  @IsOptional()
  @IsString()
  @IsEnum(AccountType)
  accountType?: keyof typeof AccountType;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  lastName?: string;

  @IsOptional()
  @MinLength(10)
  @MaxLength(14)
  phone?: string | undefined;

  @IsEmpty()
  accountStatus?: "Active" | "Inactive" | "Suspended" | "Deleted" | undefined;

  @IsEmpty()
  password?: string | undefined;
}

export class UpdatePasswordDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  oldPassword: string = "";

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  newPassword: string = "";
}
