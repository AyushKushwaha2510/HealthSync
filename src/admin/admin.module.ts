import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { DoctorRegistrationRequestModule } from 'src/doctor-registration-request/doctor-registration-request.module';
import { DoctorsService } from 'src/doctors/doctors.service';
import { DoctorsModule } from 'src/doctors/doctors.module';

@Module({
  imports: [
    DoctorRegistrationRequestModule,
    DoctorsModule,
    TypeOrmModule.forFeature([Admin])
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService]
})
export class AdminModule { }
