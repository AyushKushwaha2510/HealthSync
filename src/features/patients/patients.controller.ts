import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { DoctorRegistrationRequestService } from 'src/features/doctor-registration-request/doctor-registration-request.service';
import { CreateDoctorRegistrationRequestDto } from 'src/features/doctor-registration-request/dto/create-doctor-registration-request.dto';
import { JwtAuthGuard } from 'src/features/auth/jwt.guard';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMyDetails(@Req() req) {
    return this.patientsService.findMyDetails(req.user.userId);
  }
}
