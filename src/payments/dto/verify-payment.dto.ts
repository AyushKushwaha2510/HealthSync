import { IsString } from 'class-validator';

export class VerifyPaymentDto {
  @IsString()
  externalOrderId!: string;

  @IsString()
  externalPaymentId!: string;

  @IsString()
  externalSignature!: string;
}
