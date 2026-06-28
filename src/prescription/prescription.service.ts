import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { Prescription } from './entities/prescription.entity';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from 'src/users/entities/user.entity';
import { JwtPayloadType } from 'src/types/payload.types';
import { PatientsService } from 'src/patients/patients.service';

@Injectable()
export class PrescriptionService {
  constructor(
    @InjectRepository(Prescription)
    private readonly prescriptionRepository: Repository<Prescription>,

    private readonly appointmentService: AppointmentsService,
    private readonly patientService: PatientsService,
  ) {}

  async create(createPrescriptionDto: CreatePrescriptionDto) {
    // extract the appointment object from id
    const appointment = (
      await this.appointmentService.findOne(createPrescriptionDto.appointmentId)
    ).data;

    if (!appointment)
      throw new BadRequestException(
        'Prescription must belong to an appointment',
      );

    // check for existing prescription
    const existingPrescription = await this.prescriptionRepository.findOne({
      where: {
        appointment: {
          id: createPrescriptionDto.appointmentId,
        },
      },
    });

    if (existingPrescription)
      throw new InternalServerErrorException(
        'Prescription already added to this appointment, cannot add a new one',
      );

    // create prescription object
    const prescription = {
      appointment,
      ...createPrescriptionDto,
    };

    const newPrescription =
      await this.prescriptionRepository.save(prescription);

    if (!newPrescription)
      throw new InternalServerErrorException(
        'Unable to add prescription. Please try again',
      );

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Prescription Added Successfully',
    };
  }

  async findAll(doctorId?: string, patientId?: string, user?: JwtPayloadType) {
    const criteria = {
      ...(doctorId && { doctorId }),
      ...(patientId && { patientId }),
    };

    if (user?.role === Role.PATIENT) {
      // Patient can only see their prescriptions
      const patient = await this.patientService.findOne(user?.userId);
      criteria.patientId = patient.data?.id;
    }

    const prescriptions = await this.prescriptionRepository.find({
      where: {
        appointment: {
          doctor: {
            id: criteria.doctorId,
          },
          patient: {
            id: criteria.patientId,
          },
        },
      },
      relations: {
        appointment: true,
      },
      select: {
        id: true,
        notes: true,
        appointment: {
          date: true,
        },
      },
    });

    if (!prescriptions) throw new NotFoundException('Prescription Not Found');

    return prescriptions;
  }

  findOne(id: string) {
    return this.prescriptionRepository.findOneBy({ id });
  }

  update(id: string, updatePrescriptionDto: UpdatePrescriptionDto) {
    return this.prescriptionRepository.update(id, updatePrescriptionDto);
  }

  remove(id: string) {
    return this.prescriptionRepository.delete({ id });
  }
}
