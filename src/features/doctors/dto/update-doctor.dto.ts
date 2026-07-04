import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorDto } from './create-doctor.dto';
import { IsArray, IsInt, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  readonly experience?: number;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  readonly hospitalIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  readonly clinicIds?: string[];

  @IsNumber()
  @IsOptional()
  @Min(0)
  readonly appointmentFee?: number;
}
