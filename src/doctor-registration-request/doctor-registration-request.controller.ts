import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorRegistrationRequestService } from './doctor-registration-request.service';
import { CreateDoctorRegistrationRequestDto } from './dto/create-doctor-registration-request.dto';
import { UpdateDoctorRegistrationRequestDto } from './dto/update-doctor-registration-request.dto';

@Controller('doctor-registration-request')
export class DoctorRegistrationRequestController {
  constructor(private readonly doctorRegistrationRequestService: DoctorRegistrationRequestService) {}

  // @Post()
  // create(@Body() createDoctorRegistrationRequestDto: CreateDoctorRegistrationRequestDto) {
  //   return this.doctorRegistrationRequestService.create(createDoctorRegistrationRequestDto);
  // }

  // @Get()
  // findAll() {
  //   return this.doctorRegistrationRequestService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.doctorRegistrationRequestService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateDoctorRegistrationRequestDto: UpdateDoctorRegistrationRequestDto) {
  //   return this.doctorRegistrationRequestService.update(+id, updateDoctorRegistrationRequestDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.doctorRegistrationRequestService.remove(+id);
  // }
}
