import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from 'env-validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from 'db/data-source';
import { PatientsModule } from './patients/patients.module';
import { DoctorsModule } from './doctors/doctors.module';
import { HospitalsModule } from './hospitals/hospitals.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { DoctorRegistrationRequestModule } from './doctor-registration-request/doctor-registration-request.module';
import { AdminModule } from './admin/admin.module';
import { ClinicsModule } from './clinics/clinics.module';
import { DoctorsAvailabilityModule } from './doctors-availability/doctors-availability.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:['.env.development', '.env.production'],
      isGlobal:true,
      load:[configuration],
      validate:validate
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    UsersModule,
    PatientsModule,
    DoctorsModule,
    HospitalsModule,
    AppointmentsModule,
    AuthModule,
    SeedModule,
    DoctorRegistrationRequestModule,
    AdminModule,
    ClinicsModule,
    DoctorsAvailabilityModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
