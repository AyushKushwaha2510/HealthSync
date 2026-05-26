import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Appointment } from "src/appointments/entities/appointment.entity";
import { Doctor } from "src/doctors/entities/doctor.entity";
import { Patient } from "src/patients/entities/patient.entity";
import { User } from "src/users/entities/user.entity";

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],

    useFactory: async (
        configService: ConfigService
    ): Promise<TypeOrmModuleOptions> => {
        return {
            type: "postgres",
            host: configService.get<string>("dbHost"),
            port: configService.get<number>("dbPort"),
            username: configService.get<string>("dbUsername"),
            database: configService.get<string>("dbName"),
            password: configService.get<string>("dbPassword"),
            // entities: ["dist/**/*.entity.js"],
            entities: [User, Patient, Doctor, Appointment],
            // synchronize: false,
            synchronize: true, // keep it false in production
            migrations: ["dist/db/migrations/*.js"],
        };
    },
};
