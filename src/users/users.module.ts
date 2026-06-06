import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PatientsModule } from 'src/patients/patients.module';
import { Patient } from 'src/patients/entities/patient.entity';
import { DoctorRegistrationRequestModule } from 'src/doctor-registration-request/doctor-registration-request.module';
import { AdminModule } from 'src/admin/admin.module';
import { AdminService } from 'src/admin/admin.service';
import { Admin } from 'src/admin/entities/admin.entity';

@Module({
  imports: [
    PatientsModule,
    DoctorRegistrationRequestModule,
    TypeOrmModule.forFeature([User, Patient, Admin]),
  ],
  controllers: [UsersController],
  providers: [UsersService, AdminService],
  exports: [UsersService],
})
export class UsersModule {}
