import { IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class MakePaymentDTO {
  @IsNotEmpty()
  @IsMongoId()
  paymentId!: string;

  @IsNotEmpty()
  amount!: string;

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
export class RequestPaymentDTO {
  @IsNotEmpty()
  @IsMongoId()
  paymentId!: string;
}
