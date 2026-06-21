import { IsString, IsUUID } from 'class-validator';

export class VerifyPaymentDto {
  @IsString()
  externalOrderId!: string;

  @IsString()
  externalPaymentId!: string;

  @IsString()
  externalSignature!: string;

  @IsUUID()
  appointmentId!: string;
}
