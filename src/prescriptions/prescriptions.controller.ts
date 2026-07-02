import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { PrescriptionService } from './prescriptions.service';
import { CreatePrescriptionDto } from './dto/create-prescriptions.dto';
import { UpdatePrescriptionDto } from './dto/update-prescriptions.dto';
import { JwtDoctorGuard } from 'src/doctors/doctor.guard';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('prescriptions')
export class PrescriptionController {
  constructor(private readonly prescriptionService: PrescriptionService) {}

  @Post()
  @UseGuards(JwtDoctorGuard)
  create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
    return this.prescriptionService.create(createPrescriptionDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Req() req,
    @Query('doctorId') doctorId: string,
    @Query('patientId') patientId: string,
  ) {
    return this.prescriptionService.findAll(doctorId, patientId, req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prescriptionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePrescriptionDto: UpdatePrescriptionDto,
  ) {
    return this.prescriptionService.update(id, updatePrescriptionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prescriptionService.remove(id);
  }

  @Get('download/:id/pdf')
  download(
    @Param('id') id: string, 
    @Res() res
  ) {
    return this.prescriptionService.download(id, res);
  }
}
