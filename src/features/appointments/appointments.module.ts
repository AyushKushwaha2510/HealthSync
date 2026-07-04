import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Patient } from 'src/features/patients/entities/patient.entity';
import { Doctor } from 'src/features/doctors/entities/doctor.entity';
import { Hospital } from 'src/features/hospitals/entities/hospital.entity';
import { Entity } from 'typeorm';
import { Clinic } from 'src/features/clinics/entities/clinic.entity';
import { PatientsService } from 'src/features/patients/patients.service';
import { DoctorsService } from 'src/features/doctors/doctors.service';
import { HospitalsService } from 'src/features/hospitals/hospitals.service';
import { ClinicsService } from 'src/features/clinics/clinics.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Patient, Doctor, Hospital, Clinic]),
  ],
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    PatientsService,
    DoctorsService,
    HospitalsService,
    ClinicsService,
  ],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
