import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorDto } from './create-doctor.dto';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDoctorDto extends PartialType(CreateDoctorDto) {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  readonly experience?: number;

  @IsString()
  @IsOptional()
  readonly hospital?: string;
}
