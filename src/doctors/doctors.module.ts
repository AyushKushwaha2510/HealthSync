import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { DoctorsAvailability } from 'src/doctors-availability/entities/doctors-availability.entity';
import { DoctorsAvailabilityService } from 'src/doctors-availability/doctors-availability.service';
import { AppointmentsModule } from 'src/appointments/appointments.module';

@Module({
  imports: [
    UsersModule,
    AppointmentsModule,
    TypeOrmModule.forFeature([Doctor, User, DoctorsAvailability]),
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService, DoctorsAvailabilityService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
