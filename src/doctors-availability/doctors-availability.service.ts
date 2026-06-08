import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateDoctorsAvailabilityDto } from './dto/create-doctors-availability.dto';
import { UpdateDoctorsAvailabilityDto } from './dto/update-doctors-availability.dto';
import { Repository } from 'typeorm';
import { DoctorsAvailability } from './entities/doctors-availability.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorsService } from 'src/doctors/doctors.service';
import { AppointmentsService } from 'src/appointments/appointments.service';

@Injectable()
export class DoctorsAvailabilityService {
  constructor(
    @InjectRepository(DoctorsAvailability)
    private readonly availabilityRepository: Repository<DoctorsAvailability>,

    private readonly doctorService: DoctorsService,
    private readonly appointmentService: AppointmentsService,
  ) {}

  async create(userId: string, dto: CreateDoctorsAvailabilityDto) {
    // find the doctor with this id
    const doctor = await this.doctorService.findOneByUserId(userId);

    if (!doctor)
      throw new InternalServerErrorException(
        'Doctor not associated with this user',
      );

    const availability = new DoctorsAvailability();

    availability.doctor = doctor.data;
    availability.day = dto.day;
    availability.startTime = dto.startTime;
    availability.endTime = dto.endTime;
    availability.slotDuration = dto.slotDuration;

    const newAvailability =
      await this.availabilityRepository.save(availability);
    if (!newAvailability)
      throw new InternalServerErrorException(
        'An error cccured while adding availability',
      );

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Availability added',
      data: newAvailability,
    };
  }

  async findAll(
    doctorIds?: string[],
    weekdays?: string[],
    fromDate?: string,
    toDate?: string,
    timings?: string[],
    hospitalIds?: string[],
    clinicIds?: string[],
  ) {
    const criteria = {
      ...(doctorIds && { doctorIds }),
      ...(weekdays && { weekdays }),
      ...(timings && { timings }),
      ...(hospitalIds && { hospitalIds }),
      ...(clinicIds && { clinicIds }),
    };

    // calculate the current appointment count of doctor in the selected hospital/clinic
    // const currentAppointmentCount =
    //   await this.appointmentService.findAllAndCount(doctorIds, fromDate, toDate, hospitalIds, clinicIds);

    const availableDoctors = await this.availabilityRepository.find()
      return`This action returns all doctorsAvailability`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctorsAvailability`;
  }

  update(
    id: number,
    updateDoctorsAvailabilityDto: UpdateDoctorsAvailabilityDto,
  ) {
    return `This action updates a #${id} doctorsAvailability`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctorsAvailability`;
  }
}
