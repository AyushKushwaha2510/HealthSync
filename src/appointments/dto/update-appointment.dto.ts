import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointment.dto';
import { IsEnum } from 'class-validator';
import { Status } from '../entities/appointment.entity';

export class UpdateAppointmentDto extends PartialType(CreateAppointmentDto) {
  @IsEnum(Status)
  readonly status?: Status;
}
