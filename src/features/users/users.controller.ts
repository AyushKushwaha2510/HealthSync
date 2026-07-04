import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/features/auth/jwt.guard';
import { DoctorRegistrationRequestService } from 'src/features/doctor-registration-request/doctor-registration-request.service';
import { CreateDoctorRegistrationRequestDto } from 'src/features/doctor-registration-request/dto/create-doctor-registration-request.dto';
import { AdminService } from 'src/features/admin/admin.service';
import { DoctorsService } from 'src/features/doctors/doctors.service';
import { Role } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly adminService: AdminService,
    private readonly doctorService: DoctorsService,
    private readonly doctorRegistrationRequestService: DoctorRegistrationRequestService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req) {
    if (req.user.role === Role.PATIENT) {
      return await this.usersService.findOne(req.user);
    }

    if (req.user.role === Role.ADMIN) {
      return await this.adminService.findOne(req.user);
    }
    if (req.user.role === Role.DOCTOR) {
      const { data, ...result } = await this.doctorService.findOneByUserId(
        req.user.userId,
      );
      const { user, ...doctor } = data;
      return { ...user, doctor };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('doctor-registeration-request')
  doctorRegistertRequest(
    @Body() dto: CreateDoctorRegistrationRequestDto,
    @Req() req,
  ) {
    return this.doctorRegistrationRequestService.registrationRequestAsDoctor(
      dto,
      req.user.email,
    );
  }
}
