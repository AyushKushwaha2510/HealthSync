import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DoctorsAvailabilityService } from './doctors-availability.service';
import { CreateDoctorsAvailabilityDto } from './dto/create-doctors-availability.dto';
import { UpdateDoctorsAvailabilityDto } from './dto/update-doctors-availability.dto';
import { CheckDoctorsAvailabilityDto } from './dto/check-availability.dto';
import { WeekDays } from 'src/types/week.type';

@Controller('doctors-availability')
export class DoctorsAvailabilityController {
  constructor(
    private readonly doctorsAvailabilityService: DoctorsAvailabilityService,
  ) {}

  // @Post()
  // create(@Body() createDoctorsAvailabilityDto: CreateDoctorsAvailabilityDto) {
  //   return this.doctorsAvailabilityService.create(createDoctorsAvailabilityDto);
  // }

  @Get()
  findAllByDoctorId(
    @Query('doctorId') doctorId?: string,
    @Query('weekday') weekday?: WeekDays,
    @Query('toDate') toDate?: string,
    @Query('fromDate') fromDate?: string,
    @Query('hospitalId') hospitalId?: string,
    @Query('clinicId') clinicId?: string,
  ) {
    return this.doctorsAvailabilityService.availablilityInfoByDoctorId({
      doctorId,
      weekday,
      toDate,
      fromDate,
      hospitalId,
      clinicId,
    });
  }

  // @Get()
  // availablilityInfo(@Body() dto: CheckDoctorsAvailabilityDto) {
  //   return this.doctorsAvailabilityService.availablilityInfo(dto);
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorsAvailabilityService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDoctorsAvailabilityDto: UpdateDoctorsAvailabilityDto,
  ) {
    return this.doctorsAvailabilityService.update(
      +id,
      updateDoctorsAvailabilityDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorsAvailabilityService.remove(+id);
  }
}
