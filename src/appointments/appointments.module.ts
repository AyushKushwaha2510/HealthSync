import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Hospital } from 'src/hospitals/entities/hospital.entity';
import { Entity } from 'typeorm';
import { Clinic } from 'src/clinics/entities/clinic.entity';
import { PatientsService } from 'src/patients/patients.service';
import { DoctorsService } from 'src/doctors/doctors.service';
import { HospitalsService } from 'src/hospitals/hospitals.service';
import { ClinicsService } from 'src/clinics/clinics.service';

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
