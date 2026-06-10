import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateAppointmentDto {
  @IsDateString()
  @IsNotEmpty({ message: 'Select a date and time' })
  appointmentDateTime!: Date;

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