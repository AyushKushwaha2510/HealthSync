import { Type } from 'class-transformer';
import { IsInt, IsString, Min } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  readonly specialization!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  readonly experience!: number;

  @IsString()
  readonly hospital!: string;

  @IsString()
  readonly licenseNumber!: string;
}
