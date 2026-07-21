import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailVerificationMailDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;
}
