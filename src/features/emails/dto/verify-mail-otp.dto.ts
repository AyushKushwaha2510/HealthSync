import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class VerifyMailOtpDto {
  @IsNumber()
  @IsNotEmpty()
  readonly otp!: number;

  @IsEmail()
  @IsNotEmpty()
  readonly email!: string;
}
