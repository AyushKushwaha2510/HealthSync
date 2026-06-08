import { Module } from '@nestjs/common';
import { DoctorsAvailabilityService } from './doctors-availability.service';
import { DoctorsAvailabilityController } from './doctors-availability.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorsAvailability } from './entities/doctors-availability.entity';
import { DoctorsModule } from 'src/doctors/doctors.module';

@Module({
  imports: [DoctorsModule, TypeOrmModule.forFeature([DoctorsAvailability])],
  controllers: [DoctorsAvailabilityController],
  providers: [DoctorsAvailabilityService],
  exports: [DoctorsAvailabilityService],
})
export class DoctorsAvailabilityModule {}
