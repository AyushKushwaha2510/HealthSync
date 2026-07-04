import { forwardRef, Module } from '@nestjs/common';
import { DoctorRegistrationRequestService } from './doctor-registration-request.service';
import { DoctorRegistrationRequestController } from './doctor-registration-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorRegistrationRequest } from './entities/doctor-registration-request.entity';
import { User } from 'src/features/users/entities/user.entity';
import { UsersModule } from 'src/features/users/users.module';
import { Doctor } from 'src/features/doctors/entities/doctor.entity';
import { HospitalsModule } from 'src/features/hospitals/hospitals.module';
import { Hospital } from 'src/features/hospitals/entities/hospital.entity';
import { Clinic } from 'src/features/clinics/entities/clinic.entity';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([
      DoctorRegistrationRequest,
      User,
      Doctor,
      Hospital,
      Clinic,
    ]),
  ],
  controllers: [DoctorRegistrationRequestController],
  providers: [DoctorRegistrationRequestService],
  exports: [DoctorRegistrationRequestService],
})
export class DoctorRegistrationRequestModule {}
