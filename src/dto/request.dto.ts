import { IRequest } from "../models/interface";
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MinLength,
} from "class-validator";

export class CreateRequestDTO implements Partial<IRequest> {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  fullName: string = "";

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string | undefined;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string = "";

  @IsOptional()
  @IsString()
  @MinLength(2)
  state?: string | undefined;

  @IsOptional()
  @IsString()
  city?: string | undefined;

  @IsOptional()
  @IsString()
  zipCode?: string | undefined;

  @IsNotEmpty()
  @IsString()
  service: string = "";

  @IsNotEmpty()
  @IsDateString()
  date: string = "";

  @IsOptional()
  @IsString()
  detail?: string | undefined;
}

export class UpdateRequestDTO implements Partial<IRequest> {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  fullName: string = "";

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string | undefined;

  @IsNotEmpty()
  @IsPhoneNumber()
  phoneNumber: string = "";

  @IsOptional()
  @IsString()
  @MinLength(2)
  state?: string | undefined;

  @IsOptional()
  @IsString()
  city?: string | undefined;

  @IsOptional()
  @IsString()
  zipCode?: string | undefined;

  @IsNotEmpty()
  @IsString()
  service: string = "";

  @IsNotEmpty()
  @IsDateString()
  date: string = "";

  @IsOptional()
  @IsString()
  detail?: string | undefined;
}
