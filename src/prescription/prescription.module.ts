import { Module } from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { PrescriptionController } from './prescription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prescription } from './entities/prescription.entity';
import { AppointmentsModule } from 'src/appointments/appointments.module';
import { PatientsModule } from 'src/patients/patients.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Prescription]),
    AppointmentsModule,
    PatientsModule,
  ],
  controllers: [PrescriptionController],
  providers: [PrescriptionService],
})
export class PrescriptionModule {}
