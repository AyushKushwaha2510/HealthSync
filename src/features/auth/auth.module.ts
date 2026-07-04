import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/features/users/users.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWTStrategy } from './jwt-strategy';
import { DoctorsService } from 'src/features/doctors/doctors.service';
import { DoctorsModule } from 'src/features/doctors/doctors.module';
import { AdminModule } from 'src/features/admin/admin.module';
import { DoctorRegistrationRequestModule } from 'src/features/doctor-registration-request/doctor-registration-request.module';

// i did not understood this entire module
// why jwtmodule and JWTStrategy as provider
@Module({
  imports: [
    UsersModule,
    DoctorsModule,
    AdminModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),

        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy],
})
export class AuthModule {}
