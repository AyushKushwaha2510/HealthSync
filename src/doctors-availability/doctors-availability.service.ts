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
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { DoctorsService } from 'src/doctors/doctors.service';

@Injectable()
export class DoctorsAvailabilityService {
  constructor(
    @InjectRepository(DoctorsAvailability)
    private readonly availabilityRepository: Repository<DoctorsAvailability>,

    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

  async create(userId: string, dto: CreateDoctorsAvailabilityDto) {
    // find the doctor with this id
    console.log('usdrif', userId)
    const doctor = await this.doctorRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: { user: true },
    });

    if (!doctor)
      throw new InternalServerErrorException(
        'Doctor not associated with this user',
      );

    const availability = new DoctorsAvailability();
    console.log('docotr', doctor);
    availability.doctor = doctor;
    availability.day = dto.day;
    availability.startTime = dto.startTime;
    availability.endTime = addMinutes(dto.startTime, dto.slotDuration);
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

// helper to calculate end_time
function addMinutes(time: string, minutes: number): string {
  const [hours, mins] = time.split(':').map(Number);

  const total = hours * 60 + mins + minutes;

  const newHours = Math.floor(total / 60) % 24;
  const newMins = total % 60;

  return `${String(newHours).padStart(2, '0')}:${String(newMins).padStart(2, '0')}`;
}
