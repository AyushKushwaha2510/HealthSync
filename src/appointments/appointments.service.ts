import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment, Status } from './entities/appointment.entity';
import {
  Between,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { PatientsService } from 'src/patients/patients.service';
import { HospitalsService } from 'src/hospitals/hospitals.service';
import { ClinicsService } from 'src/clinics/clinics.service';
import { Clinic } from 'src/clinics/entities/clinic.entity';
import { Hospital } from 'src/hospitals/entities/hospital.entity';
import { DoctorsService } from 'src/doctors/doctors.service';

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

  async create(userId: string, dto: CreateAppointmentDto) {
    // extract patient info form this
    const { data: patient } = await this.patientService.findOne(userId);

    if (!patient) throw new NotFoundException('Patient not found');

    const { data: doctor } = await this.doctorService.findOneByUserId(
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

    appointment.appointmentDateTime = dto.appointmentDateTime;
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

  findAll() {
    return `This action returns all appointments`;
  }

  async findAllAndCount(
    fromDate: string,
    toDate: string,
    doctorId: string,
    hospitalId: string,
    clinicId: string,
  ) {
    const criteria = {
      ...(fromDate &&
        toDate && {
          appointmentDateTime: Between(new Date(fromDate), new Date(toDate)),
        }),

      ...(fromDate &&
        !toDate && {
          appointmentDateTime: MoreThanOrEqual(new Date(fromDate)),
        }),

      ...(!fromDate &&
        toDate && {
          appointmentDateTime: LessThanOrEqual(new Date(toDate)),
        }),

      ...(doctorId && { doctor: { id: doctorId } }),
      ...(hospitalId && { hospital: { id: hospitalId } }),
      ...(clinicId && { clinic: { id: clinicId } }),
    };

    const [data, count] = await this.appointmentRepository.findAndCount({
      where: criteria,
    });

    return { data, count };
  }

  findOne(id: number) {
    return `This action returns a #${id} appointment`;
  }

  update(id: number, updateAppointmentDto: UpdateAppointmentDto) {
    return `This action updates a #${id} appointment`;
  }

  remove(id: number) {
    return `This action removes a #${id} appointment`;
  }
}
