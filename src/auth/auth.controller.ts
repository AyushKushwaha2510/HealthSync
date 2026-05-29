import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login-dto';
import { AuthService } from './auth.service';
import { DoctorsService } from 'src/doctors/doctors.service';
import { CreateDoctorDto } from 'src/doctors/dto/create-doctor.dto';
import { JwtPayloadType } from 'src/types/payload.types';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly doctorService: DoctorsService,
  ) { }

  @Post('register') // default register as patient
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.registerUser(createUserDto);
  }

  @Post('login')
  login(@Body() loginDTO: LoginDTO) {
    return this.authService.login(loginDTO)
  }

  @UseGuards(JwtAuthGuard)
  @Post('register-as-doctor')
  registerAsDoctor(
    @Body() createDoctorDTO: CreateDoctorDto,
    @Request() req
  ) {
    console.log("request form ", req)
    return this.doctorService.registerAsDoctor(createDoctorDTO, req.user.email);
  }

}
