import { IRequest } from "../models/interface";
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
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
  @MinLength(10)
  @MaxLength(14)
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
  @IsOptional()
  @IsString()
  @MinLength(3)
  fullName?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string | undefined;

  @IsOptional()
  @MinLength(10)
  @MaxLength(14)
  phoneNumber?: string;

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

  @IsOptional()
  @IsString()
  service?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  detail?: string | undefined;
}
