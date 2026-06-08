import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorsAvailabilityDto } from './create-doctors-availability.dto';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { WeekDays } from 'src/types/week.type';

export class UpdateDoctorsAvailabilityDto extends PartialType(
  CreateDoctorsAvailabilityDto,
) {
  @IsEnum(WeekDays)
  @IsOptional()
  day?: WeekDays;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsNumber()
  @Min(5)
  @IsOptional()
  slotDuration!: number;
}
