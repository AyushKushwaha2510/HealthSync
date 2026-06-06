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
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { DoctorRegistrationRequestService } from 'src/doctor-registration-request/doctor-registration-request.service';
import { CreateDoctorRegistrationRequestDto } from 'src/doctor-registration-request/dto/create-doctor-registration-request.dto';
import { AdminService } from 'src/admin/admin.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly adminService: AdminService,
    private readonly doctorRegistrationRequestService: DoctorRegistrationRequestService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req) {
    if (req.user.role === 'patient') {
      return await this.usersService.findOne(req.user);
    }

    if (req.user.role === 'admin') {
      return await this.adminService.findOne(req.user);
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
