import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsDateString()
  @IsNotEmpty({ message: 'Select a date' })
  appointmentDate!: string;

  @IsString()
  @IsNotEmpty({ message: 'Select and time' })
  appointmentStartTime!: string;

  @IsString()
  @IsNotEmpty({ message: 'Select and time' })
  appointmentEndTime!: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsUUID()
  doctorId!: string;

  @IsOptional()
  @IsUUID()
  hospitalId?: string;

  @IsOptional()
  @IsUUID()
  clinicId?: string;
}
