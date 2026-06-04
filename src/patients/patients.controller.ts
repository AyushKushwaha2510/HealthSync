import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { DoctorRegistrationRequestService } from 'src/doctor-registration-request/doctor-registration-request.service';
import { CreateDoctorRegistrationRequestDto } from 'src/doctor-registration-request/dto/create-doctor-registration-request.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('patients')
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly doctorRegistrationRequestService: DoctorRegistrationRequestService,
  ) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMyDetails(@Req() req) {
    console.log('CONTROLLER HIT', req.user);
    return this.patientsService.findMyDetails(req.user.userId);
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
