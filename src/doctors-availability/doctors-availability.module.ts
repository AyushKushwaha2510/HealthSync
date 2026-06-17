import { Module } from '@nestjs/common';
import { DoctorsAvailabilityService } from './doctors-availability.service';
import { DoctorsAvailabilityController } from './doctors-availability.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsAvailability } from './entities/doctors-availability.entity';
import { DoctorsModule } from 'src/doctors/doctors.module';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { HospitalsService } from 'src/hospitals/hospitals.service';
import { ClinicsService } from 'src/clinics/clinics.service';
import { Hospital } from 'src/hospitals/entities/hospital.entity';
import { Clinic } from 'src/clinics/entities/clinic.entity';

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
