import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
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
  @IsPhoneNumber()
  phone?: string | undefined;

  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string | undefined;
}

export class UpdateAccountDTO implements Partial<IAccount> {
  @IsOptional()
  @IsString()
  @IsEnum(AccountType)
  accountType: "Admin" | "Staff" | "Customer" = "Customer";

  @IsOptional()
  @IsString()
  @IsEmail()
  email: string = "";

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  firstName: string = "";

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  lastName: string = "";

  @IsOptional()
  @IsPhoneNumber()
  phone?: string | undefined;
}

export class UpdatePasswordDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string = "";
}
