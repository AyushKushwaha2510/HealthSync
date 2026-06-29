import { Module } from '@nestjs/common';
import { PrescriptionService } from './prescriptions.service';
import { PrescriptionController } from './prescriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prescription } from './entities/prescriptions.entity';
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
