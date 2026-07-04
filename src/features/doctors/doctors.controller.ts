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
  Query,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { CreateDoctorsAvailabilityDto } from 'src/features/doctors-availability/dto/create-doctors-availability.dto';
import { JwtDoctorGuard } from './doctor.guard';
import { DoctorsAvailabilityService } from 'src/features/doctors-availability/doctors-availability.service';
import { JwtAuthGuard } from 'src/features/auth/jwt.guard';

@Controller('doctors')
export class DoctorsController {
  constructor(
    private readonly doctorsService: DoctorsService,
    private readonly availabilityService: DoctorsAvailabilityService,
  ) {}

  @Get('profile/:id')
  profile(@Param('id') id: string) {
    return this.doctorsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  myProfile(@Req() req) {
    return this.doctorsService.myProfile(req.user.userId);
  }

  @Get()
  findAll(
    @Query('specialization') specialization: string,
    @Query('hospital') hospital: string,
  ) {
    return this.doctorsService.findAll(specialization, hospital);
  }

  @UseGuards(JwtDoctorGuard)
  @Post('add-availability')
  async addAvailability(
    @Req() req,
    @Body() data: CreateDoctorsAvailabilityDto,
  ) {
    return this.availabilityService.create(req.user.userId, data);
  }

  @UseGuards(JwtDoctorGuard)
  @Get('view-availability')
  async viewAvailability(@Req() req) {
    return this.availabilityService.findAll(req.user.userId);
  }

  @Get(':id')
  findOneWithAvailableSlots(
    @Param('id') id: string,
    @Query('date') date: string,
    @Query('hospitalId') hospitalId?: string,
    @Query('clinicId') clinicId?: string,
  ) {
    return this.doctorsService.findOneWithAvailableSlots(
      id,
      date,
      hospitalId,
      clinicId,
    );
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(+id, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorsService.remove(id);
  }
}
