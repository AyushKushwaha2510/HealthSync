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

@Controller('doctors-availability')
export class DoctorsAvailabilityController {
  constructor(
    private readonly doctorsAvailabilityService: DoctorsAvailabilityService,
  ) {}

  // @Post()
  // create(@Body() createDoctorsAvailabilityDto: CreateDoctorsAvailabilityDto) {
  //   return this.doctorsAvailabilityService.create(createDoctorsAvailabilityDto);
  // }

  // @Get()
  // findAll(
  //   @Query('doctorName') doctorName?: string[],
  //   @Query('weekdays') weekDays?: string[],
  //   @Query('timings') timings?: string[],
  //   @Query('hospitals') hospitals?: string[],
  //   @Query('clinics') clinics?: string[],
  // ) {
  //   return this.doctorsAvailabilityService.findAll(doctorName, weekDays, timings, hospitals, clinics);
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
