import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PatientsModule } from 'src/features/patients/patients.module';
import { Patient } from 'src/features/patients/entities/patient.entity';
import { DoctorRegistrationRequestModule } from 'src/features/doctor-registration-request/doctor-registration-request.module';
import { AdminModule } from 'src/features/admin/admin.module';
import { AdminService } from 'src/features/admin/admin.service';
import { Admin } from 'src/features/admin/entities/admin.entity';
import { DoctorsModule } from 'src/features/doctors/doctors.module';
import { Doctor } from 'src/features/doctors/entities/doctor.entity';
import { DoctorsService } from 'src/features/doctors/doctors.service';

@Module({
  imports: [
    PatientsModule,
    DoctorRegistrationRequestModule,
    TypeOrmModule.forFeature([User, Patient, Admin, Doctor]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AdminService, DoctorsService],
  exports: [UsersService],
})
export class UsersModule {}
