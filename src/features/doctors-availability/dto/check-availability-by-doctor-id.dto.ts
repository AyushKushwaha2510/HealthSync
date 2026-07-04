
import { IsArray, IsDateString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { WeekDays } from 'src/types/week.type';

export class CheckDoctorsAvailabilityByDoctorIdDto {
  @IsOptional()
  @IsUUID('4', { each: true })
  doctorId?: string;

  @IsOptional()
  @IsEnum(WeekDays, { each: true })
  weekday?: WeekDays;

  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @IsOptional()
  @IsDateString()
  toDate?: string;

  @IsOptional()
  @IsUUID('4', { each: true })
  hospitalId?: string;

  @IsOptional()
  @IsUUID('4', { each: true })
  clinicId?: string;
}
