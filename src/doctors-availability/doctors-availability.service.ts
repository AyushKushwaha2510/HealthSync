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

@Injectable()
export class DoctorsAvailabilityService {
  constructor(
    @InjectRepository(DoctorsAvailability)
    private readonly availabilityRepository: Repository<DoctorsAvailability>,

    private readonly doctorService: DoctorsService,
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

  findAll() {
    return `This action returns all doctorsAvailability`;
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