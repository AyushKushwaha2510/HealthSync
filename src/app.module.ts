import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './features/users/users.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from 'env-validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from 'db/data-source';
import { PatientsModule } from './features/patients/patients.module';
import { DoctorsModule } from './features/doctors/doctors.module';
import { HospitalsModule } from './features/hospitals/hospitals.module';
import { AppointmentsModule } from './features/appointments/appointments.module';
import { AuthModule } from './features/auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { DoctorRegistrationRequestModule } from './features/doctor-registration-request/doctor-registration-request.module';
import { AdminModule } from './features/admin/admin.module';
import { ClinicsModule } from './features/clinics/clinics.module';
import { DoctorsAvailabilityModule } from './features/doctors-availability/doctors-availability.module';
import { PaymentsModule } from './features/payments/payments.module';
import { PrescriptionModule } from './features/prescriptions/prescriptions.module';
import { AiModule } from './features/ai/ai.module';
import { EmailsModule } from './features/emails/emails.module';
import { CleanupModule } from './features/cleanup/cleanup.module';
import { MessagesModule } from './features/messages/messages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.production'],
      isGlobal: true,
      load: [configuration],
      validate: validate,
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
    DoctorsAvailabilityModule,
    PaymentsModule,
    PrescriptionModule,
    AiModule,
    EmailsModule,
    CleanupModule,
    MessagesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
