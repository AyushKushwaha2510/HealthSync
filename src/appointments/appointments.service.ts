import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment, Status } from './entities/appointment.entity';
import { Between, In, Repository } from 'typeorm';
import { PatientsService } from 'src/patients/patients.service';
import { HospitalsService } from 'src/hospitals/hospitals.service';
import { ClinicsService } from 'src/clinics/clinics.service';
import { Clinic } from 'src/clinics/entities/clinic.entity';
import { Hospital } from 'src/hospitals/entities/hospital.entity';
import { DoctorsService } from 'src/doctors/doctors.service';
import { JwtPayloadType } from 'src/types/payload.types';
import { Role } from 'src/users/entities/user.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,

    private readonly patientService: PatientsService,
    private readonly doctorService: DoctorsService,
    private readonly hospitalService: HospitalsService,
    private readonly clinicService: ClinicsService,
  ) {}

  // ==== CREATE APPOINTMENT ==== //
  async create(userId: string, dto: CreateAppointmentDto) {
    // extract patient info form this
    const { data: patient } = await this.patientService.findOne(userId);

    if (!patient) throw new NotFoundException('Patient not found');

    const { data: doctor } = await this.doctorService.findOneByDoctorId(
      dto.doctorId,
    );
    if (!doctor) throw new BadRequestException('Please select a doctor');

    let clinic: Clinic | null = null;
    let hospital: Hospital | null = null;

    if (dto.clinicId) {
      const result = await this.clinicService.findOne(dto.clinicId);
      clinic = result.data;
    } else if (dto.hospitalId) {
      const result = await this.hospitalService.findOne(dto.hospitalId);
      hospital = result.data;
    } else {
      throw new BadRequestException('Please select a clinic or hospital');
    }

    const appointment = new Appointment();

    appointment.date = dto.appointmentDate;
    appointment.startTime = dto.appointmentStartTime;
    appointment.endTime = dto.appointmentEndTime;
    appointment.bookingDateTime = new Date(Date.now());
    appointment.notes = dto.notes;
    appointment.status = Status.PENDING_PAYMENT;
    appointment.patient = patient;
    appointment.doctor = doctor;
    if (clinic) appointment.clinic = clinic;
    if (hospital) appointment.hospital = hospital;

    appointment.expiresAt = new Date(
      Date.now() + 5 * 60 * 1000, // 5 minutes
    );

    // the status will we pending_payment till the payment confirmation,
    // but block this slot for 5 minutes

    return await this.appointmentRepository.save(appointment);
  }

  // ==== FIND ALL APPOINTMENTS ==== //
  async findAll(user: JwtPayloadType) {
    let appointments: Appointment[] | null = null;

    // if user is admin show all appointments
    if (user.role === Role.ADMIN) {
      appointments = (await this.appointmentRepository.find()).sort();
    }

    // show only his appointments
    if (user.role === Role.PATIENT) {
      appointments = await this.appointmentRepository.find({
        where: {
          patient: {
            user: {
              id: user.userId,
            },
          },
        },
        relations: {
          patient: true,
          doctor: true,
          hospital: true,
          clinic: true,
        },
      });
    }

    // show only his appointments
    if (user.role === Role.DOCTOR) {
      appointments = await this.appointmentRepository.find({
        where: {
          doctor: {
            user: {
              id: user.userId,
            },
          },
        },
        relations: {
          patient: {
            user: true,
          },
          doctor: {
            user: true,
          },
          hospital: true,
          clinic: true,
        },
      });
    }

    if (!appointments)
      throw new NotFoundException('You don&apos;t have any appointments');

    return {
      stautusCode: HttpStatus.FOUND,
      message: 'success',
      data: appointments,
    };
  }

  async findAllAndCount(criteria: {
    fromDate?: string;
    toDate?: string;
    doctorIds?: string[];
    hospitalIds?: string[];
    clinicIds?: string[];
  }) {
    const where: any = {};

    if (criteria.fromDate && criteria.toDate) {
      where.date = Between(criteria.fromDate, criteria.toDate);
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

    where.status = In([Status.CONFIRMED, Status.PENDING_PAYMENT]);

    const [data, count] = await this.appointmentRepository.findAndCount({
      where,
      relations: {
        doctor: true,
        hospital: true,
        clinic: true,
      },
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });

    return { data, count };
  }

  // ==== FIND ALL APPOINTMENTS BY DOCTOR ID ==== //
  async findAllAndCountByDoctorId(criteria: {
    doctorId?: string;
    hospitalId?: string;
    clinicId?: string;
    fromDate?: string;
    toDate?: string;
  }) {
    const where: any = {};

    if (criteria.fromDate && criteria.toDate) {
      where.date = Between(criteria.fromDate, criteria.toDate);
    }

    if (criteria.doctorId) {
      where.doctor = {
        id: criteria.doctorId,
      };
    }

    if (criteria.hospitalId) {
      where.hospital = {
        id: criteria.hospitalId,
      };
    }

    if (criteria.clinicId) {
      where.clinic = {
        id: criteria.clinicId,
      };
    }

    where.status = In([Status.CONFIRMED, Status.PENDING_PAYMENT]);

    const [data, count] = await this.appointmentRepository.findAndCount({
      where,
      // relations: {
      //   doctor: true,
      //   hospital: true,
      //   clinic: true,
      // },
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });

    return { data, count };
  }

  async findOne(id: string) {
    const appointment = await this.appointmentRepository.findOneBy({ id });

    if (!appointment) throw new NotFoundException('No Appointment Found');

    return {
      statusCode: HttpStatus.FOUND,
      message: 'success',
      data: appointment,
    };
  }

  async findOneWithDetails(id: string) {
    const appointment = await this.appointmentRepository.findOne({
      where: {
        id,
      },
      relations: {
        patient: {
          user: true,
        },
        prescription: true,
      },
    });

    if (!appointment) throw new NotFoundException('No Appointment Found');
    console.log("appointment", appointment)
    return {
      statusCode: HttpStatus.FOUND,
      message: 'success',
      data: appointment,
    };
  }

  async update(id: string, updateAppointmentDto: UpdateAppointmentDto) {
    return this.appointmentRepository.update(id, updateAppointmentDto);
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
