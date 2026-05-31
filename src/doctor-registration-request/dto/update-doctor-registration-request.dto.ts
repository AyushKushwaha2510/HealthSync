import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorRegistrationRequestDto } from './create-doctor-registration-request.dto';
import { IsEnum, IsString } from 'class-validator';
import { Status } from '../entities/doctor-registration-request.entity';

export class UpdateDoctorRegistrationRequestDto extends PartialType(CreateDoctorRegistrationRequestDto) {

    @IsEnum(Status)
    readonly status!: Status;

    @IsString()
    readonly rejectionReason?: string;
}
