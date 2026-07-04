import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  appointmentId!: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Pay the Amount' })
  amount!: number;
  // TODO: Add check for the payment amount
}
