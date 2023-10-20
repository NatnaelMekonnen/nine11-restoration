import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
} from "class-validator";

export class MakePaymentDTO {
  @IsNotEmpty()
  @IsMongoId()
  paymentId!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  amount!: number;

  @IsNotEmpty()
  checkImage!: Express.Multer.File;
}

export class ConfirmPaymentDTO {
  @IsNotEmpty()
  @IsMongoId()
  paymentId!: string;

  @IsNotEmpty()
  @IsString()
  paymentRef!: string;
}
