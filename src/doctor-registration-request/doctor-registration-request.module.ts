import { forwardRef, Module } from '@nestjs/common';
import { DoctorRegistrationRequestService } from './doctor-registration-request.service';
import { DoctorRegistrationRequestController } from './doctor-registration-request.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorRegistrationRequest } from './entities/doctor-registration-request.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([DoctorRegistrationRequest, User]),
  ],
  controllers: [DoctorRegistrationRequestController],
  providers: [DoctorRegistrationRequestService],
  exports: [DoctorRegistrationRequestService],
})
export class DoctorRegistrationRequestModule {}
