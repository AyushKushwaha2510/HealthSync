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
import { CreateDoctorsAvailabilityDto } from 'src/doctors-availability/dto/create-doctors-availability.dto';
import { JwtDoctorGuard } from './doctor.guard';
import { DoctorsAvailabilityService } from 'src/doctors-availability/doctors-availability.service';

@Controller('doctors')
export class DoctorsController {
  constructor(
    private readonly doctorsService: DoctorsService,
    private readonly availabilityService: DoctorsAvailabilityService,
  ) {}

  // @Post()
  // create(@Body() createDoctorDto: CreateDoctorDto) {
  //   return this.doctorsService.create(createDoctorDto);
  // }

  @Get()
  findAll() {
    return this.doctorsService.findAll();
  }

  @Get(':id')
  findOneWithAvailableSlots(
    @Param('id') id: string,
    @Query('date') date: string,
    @Query('hospitalId') hospitalId?: string,
    @Query('clinicId') clinicId?: string,
  ) {
    return this.doctorsService.findOneWithAvailableSlots(id, date, hospitalId, clinicId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorDto: UpdateDoctorDto) {
    return this.doctorsService.update(+id, updateDoctorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorsService.remove(id);
  }

  @UseGuards(JwtDoctorGuard)
  @Post('add-availability')
  async addAvailability(
    @Req() req,
    @Body() data: CreateDoctorsAvailabilityDto,
  ) {
    console.log('req user', req.user);
    return this.availabilityService.create(req.user.userId, data);
  }
}
