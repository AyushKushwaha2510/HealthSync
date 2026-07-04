import { IsArray, IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { WeekDays } from 'src/types/week.type';

export class CheckDoctorsAvailabilityDto {
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  doctorIds?: string[];

  @IsOptional()
  @IsArray()
  @IsEnum(WeekDays, { each: true })
  weekdays?: WeekDays[];

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  hospitalIds?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  clinicIds?: string[];
}
