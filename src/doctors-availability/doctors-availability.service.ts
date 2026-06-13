import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateDoctorsAvailabilityDto } from './dto/create-doctors-availability.dto';
import { UpdateDoctorsAvailabilityDto } from './dto/update-doctors-availability.dto';
import { Between, In, Repository } from 'typeorm';
import { DoctorsAvailability } from './entities/doctors-availability.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DoctorsService } from 'src/doctors/doctors.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { Slot } from 'src/types/slots.type';
import { CheckDoctorsAvailabilityDto } from './dto/check-availability.dto';

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
    availability.weekday = dto.weekday;
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

  async availablilityInfo(dto: CheckDoctorsAvailabilityDto) {
    const criteria = {
      ...(dto.doctorIds && { doctorIds: dto.doctorIds }),
      ...(dto.weekdays && { weekdays: dto.weekdays }),
      ...(dto.hospitalIds && { hospitalIds: dto.hospitalIds }),
      ...(dto.clinicIds && { clinicIds: dto.clinicIds }),
      ...(dto.fromDate && { fromDate: dto.fromDate }),
      ...(dto.toDate && { toDate: dto.toDate }),
    };

    const where: any = {};

    // if (criteria.fromDate && criteria.toDate) {
    //   where.startTime = Between(
    //     new Date(criteria.fromDate),
    //     new Date(criteria.toDate),
    //   );
    // }
    console.log('creitetio', criteria);
    console.log('dto', dto);
    if (criteria.weekdays?.length) {
      where.weekday = In(criteria.weekdays);
    }

    if (criteria.doctorIds?.length) {
      where.doctor = {
        id: In(criteria.doctorIds),
      };
    }

    if (criteria.hospitalIds?.length) {
      where.hospital = {
        id: In(criteria.hospitalIds),
      };
    }

    if (criteria.clinicIds?.length) {
      where.clinic = {
        id: In(criteria.clinicIds),
      };
    }

    // find the confirmed appointments for the given criterion
    // and mark those as not available
    const confirmedAppointments =
      await this.appointmentService.findAllAndCount(criteria);

    // generate slots
    // all slots
    const allSlots = await this.availabilityRepository.find({
      where,
      select: {
        doctor: true,
        hospital: true,
        clinic: true,
        weekday: true,
        startTime: true,
        endTime: true,
        slotDuration: true,
      },
      relations: {
        doctor: true,
        hospital: true,
        clinic: true,
      },
    });

    const transformedSlots = allSlots.map((slot) => {
      const slots: string[] = [];

      let current = new Date(`1970-01-01T${slot.startTime}`);
      const end = new Date(`1970-01-01T${slot.endTime}`);

      while (current < end) {
        const next = new Date(current);
        next.setMinutes(next.getMinutes() + slot.slotDuration);

        if (next > end) break;

        slots.push(
          `${current.toTimeString().slice(0, 5)}-${next
            .toTimeString()
            .slice(0, 5)}`,
        );

        current = next;
      }

      return {
        doctor: slot.doctor,
        hospital: slot.hospital,
        clinic: slot.clinic,
        weekday: slot.weekday,
        slots,
      };
    });

    // now generate available slots
    // for each date, the unavailalbe slots are in the confirmedAppointments

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: {
        allSlots:transformedSlots,
        occupiedSlots: confirmedAppointments,
      },
    };
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
