import { IsEnum, IsNotEmpty, IsString, IsNumber, Min } from "class-validator";
import { Clinic } from "src/clinics/entities/clinic.entity";
import { Hospital } from "src/hospitals/entities/hospital.entity";
import { WeekDays } from "src/types/week.type";

export class CreateDoctorsAvailabilityDto {
  @IsEnum(WeekDays)
  @IsNotEmpty({ message: 'Day is required' })
  weekday!: WeekDays;

  @IsString()
  @IsNotEmpty({ message: 'Start time is required' })
  startTime!: string;

  @IsString()
  @IsNotEmpty({ message: 'End time is required' })
  endTime!: string;

  @IsNumber()
  @Min(5)
  slotDuration!: number;

  @IsString()
  hospital?:Hospital;

  @IsString()
  clinic?:Clinic;
}