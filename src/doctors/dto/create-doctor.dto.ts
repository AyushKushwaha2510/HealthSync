import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, IsUUID, Min} from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  readonly specialization!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
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
  readonly licenseNumber!: string;
}
