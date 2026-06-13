import {
  IsArray,
  IsDateString,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class FindAppointmentsDto {
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  doctorIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  hospitalIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  clinicIds?: string[];
}