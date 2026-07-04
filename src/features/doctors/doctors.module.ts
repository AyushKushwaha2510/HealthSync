import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { UsersModule } from 'src/features/users/users.module';
import { User } from 'src/features/users/entities/user.entity';
import { DoctorsAvailability } from 'src/features/doctors-availability/entities/doctors-availability.entity';
import { DoctorsAvailabilityService } from 'src/features/doctors-availability/doctors-availability.service';
import { AppointmentsModule } from 'src/features/appointments/appointments.module';
import { HospitalsModule } from 'src/features/hospitals/hospitals.module';
import { ClinicsModule } from 'src/features/clinics/clinics.module';

@Module({
  imports: [
    UsersModule,
    AppointmentsModule,
    TypeOrmModule.forFeature([Doctor, User, DoctorsAvailability]),
    HospitalsModule,
    ClinicsModule,
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService, DoctorsAvailabilityService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
