import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { DoctorRegistrationRequestService } from 'src/doctor-registration-request/doctor-registration-request.service';
import { JwtAdminGuard } from './admin.guard';
import { UpdateDoctorRegistrationRequestDto } from 'src/doctor-registration-request/dto/update-doctor-registration-request.dto';
import { Status } from 'src/doctor-registration-request/entities/doctor-registration-request.entity';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly doctorRegistrationRequestService: DoctorRegistrationRequestService
  ) { }

  // @Post()
  // // create(@Body() createAdminDto: CreateAdminDto) {
  // //   return this.adminService.create(createAdminDto);
  // // }

  // @Get()
  // findAll() {
  //   return this.adminService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.adminService.findOne(+id);
  // }

  @UseGuards(JwtAdminGuard)
  @Get('doctor-requests')
  findAllPendingDoctorRequest() {
    return this.doctorRegistrationRequestService.findAll();
  }

  @UseGuards(JwtAdminGuard)
  @Get('doctor-requests/:id')
  findOnePendingDoctorRequest(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.doctorRegistrationRequestService.findOne(id);
  }

  @UseGuards(JwtAdminGuard)
  @Patch('doctor-requests/:id/approve')
  approveDoctorRequest(
    @Param('id') id: string,
  ) {
    return this.doctorRegistrationRequestService.updateStatus(
      id,
      Status.APPROVED
    );
  }

  @UseGuards(JwtAdminGuard)
  @Patch('doctor-requests/:id/reject')
  rejectDoctorRequest(
    @Param('id') id: string,
    @Body() dto:UpdateDoctorRegistrationRequestDto
  ) {
    return this.doctorRegistrationRequestService.updateStatus(
      id,
      Status.REJECTED,
      dto
    );
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
  //   return this.adminService.update(+id, updateAdminDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.adminService.remove(+id);
  // }
}
