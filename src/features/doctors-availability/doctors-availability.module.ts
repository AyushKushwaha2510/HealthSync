import { Module } from '@nestjs/common';
import { DoctorsAvailabilityService } from './doctors-availability.service';
import { DoctorsAvailabilityController } from './doctors-availability.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsAvailability } from './entities/doctors-availability.entity';
import { DoctorsModule } from 'src/features/doctors/doctors.module';
import { AppointmentsModule } from 'src/features/appointments/appointments.module';
import { HospitalsService } from 'src/features/hospitals/hospitals.service';
import { ClinicsService } from 'src/features/clinics/clinics.service';
import { Hospital } from 'src/features/hospitals/entities/hospital.entity';
import { Clinic } from 'src/features/clinics/entities/clinic.entity';

@Module({
  imports: [
    DoctorsModule,
    AppointmentsModule,
    TypeOrmModule.forFeature([DoctorsAvailability, Hospital, Clinic]),
  ],
  controllers: [DoctorsAvailabilityController],
  providers: [DoctorsAvailabilityService, HospitalsService, ClinicsService],
  exports: [DoctorsAvailabilityService],
})
export class DoctorsAvailabilityModule {}
