import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';
import { Appointment } from 'src/features/appointments/entities/appointment.entity';
import { Doctor } from 'src/features/doctors/entities/doctor.entity';
import { Patient } from 'src/features/patients/entities/patient.entity';
import { User } from 'src/features/users/entities/user.entity';
import { Admin } from 'src/features/admin/entities/admin.entity';
import { DoctorRegistrationRequest } from 'src/features/doctor-registration-request/entities/doctor-registration-request.entity';
import { Hospital } from 'src/features/hospitals/entities/hospital.entity';
import { Clinic } from 'src/features/clinics/entities/clinic.entity';
import { DoctorsAvailability } from 'src/features/doctors-availability/entities/doctors-availability.entity';
import { Payment } from 'src/features/payments/entities/payment.entity';
import { Prescription } from 'src/features/prescriptions/entities/prescriptions.entity';
import { AiService } from 'src/features/ai/ai.service';
import { Otp } from 'src/features/emails/entities/opt.entity';
import { Conversation } from 'src/features/conversations/entities/conversation.entity';
import { Message } from 'src/features/messages/entities/message.entity';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],

  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => {
    return {
      type: 'postgres',
      host: configService.get<string>('dbHost'),
      port: configService.get<number>('dbPort'),
      username: configService.get<string>('dbUsername'),
      database: configService.get<string>('dbName'),
      password: configService.get<string>('dbPassword'),
      // entities: ["dist/**/*.entity.js"],
      entities: [
        User,
        Patient,
        Doctor,
        Admin,
        Appointment,
        DoctorRegistrationRequest,
        Hospital,
        Clinic,
        DoctorsAvailability,
        Payment,
        Prescription,
        AiService,
        Otp,
        Conversation,
        Message
      ],
      // ssl: {
      //   rejectUnauthorized: false,
      // },
      synchronize: true,
      // synchronize: true, // keep it false in production
      migrations: ['dist/db/migrations/*.js'],
    };
  },
};
