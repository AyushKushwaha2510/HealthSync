import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateDoctorRegistrationRequestDto {
  @IsString()
  @IsNotEmpty({ message: 'Specialization is Required' })
  readonly specialization!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsNotEmpty({ message: 'Experience is Required' })
  readonly experience!: number;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  readonly hospitalIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  readonly clinicIds?: string[];

  @IsString()
  @IsNotEmpty({ message: 'License Number is Required' })
  readonly licenseNumber!: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  readonly appointmentFees!: number;
}
