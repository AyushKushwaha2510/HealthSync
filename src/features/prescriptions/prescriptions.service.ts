import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Response,
} from '@nestjs/common';
import { CreatePrescriptionDto } from './dto/create-prescriptions.dto';
import { UpdatePrescriptionDto } from './dto/update-prescriptions.dto';
import { Prescription } from './entities/prescriptions.entity';
import { AppointmentsService } from 'src/features/appointments/appointments.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from 'src/features/users/entities/user.entity';
import { JwtPayloadType } from 'src/types/payload.types';
import { PatientsService } from 'src/features/patients/patients.service';
import PDFDocument from 'pdfkit';
import path from 'path';

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

    const where = {
      appointment: {
        ...(criteria.doctorId && {
          doctor: { id: criteria.doctorId },
        }),
        ...(criteria.patientId && {
          patient: { id: criteria.patientId },
        }),
      },
    };

    const prescriptions = await this.prescriptionRepository.find({
      where,
      relations: {
        appointment: {
          doctor: {
            user: true,
          },
        },
      },
      select: {
        id: true,
        appointment: {
          id: true,
          date: true,
          startTime: true,
          doctor: {
            id: true,
            specialization: true,
            user: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    });

    if (!prescriptions) throw new NotFoundException('Prescription Not Found');
    console.log('pres', prescriptions);
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

  async download(appointmentId: string, res: any) {
    const appointment = (
      await this.appointmentService.findOneWithDetails(appointmentId)
    ).data;

    if (!appointment)
      throw new NotFoundException('Appointment Details Not Found');

    const prescription = appointment.prescription;

    // Create PDF document
    // ======= Init doc with Roboto Font ========
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50,
      info: {
        Title: `Prescription-${appointmentId}`,
        Author:
          appointment.doctor.user.firstName +
          ' ' +
          appointment.doctor.user.lastName,
        Subject: 'Medical Prescription',
        Keywords: 'prescription, medical, health',
      },
      font: path.join(
        process.cwd(),
        'public/fonts/Roboto/Roboto-VariableFont_wdth,wght.ttf',
      ),
    });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `inline; filename=prescription-${appointmentId}.pdf`,
    );

    doc.pipe(res);

    // ================= FONTS =================
    const regularFont = path.join(
      process.cwd(),
      'public/fonts/Roboto/static/Roboto-Regular.ttf',
    );

    const boldFont = path.join(
      process.cwd(),
      'public/fonts/Roboto/static/Roboto-Bold.ttf',
    );

    const semiboldFont = path.join(
      process.cwd(),
      'public/fonts/Roboto/static/Roboto-SemiBold.ttf',
    );

    doc.registerFont('regular', regularFont);
    doc.registerFont('bold', boldFont);
    doc.registerFont('semibold', semiboldFont);

    // ================= PDF Starts =================
    doc.fontSize(22).font('bold').text('HealthSync', {
      align: 'center',
    });

    doc.fontSize(16).text('Medical Prescription', {
      align: 'center',
    });

    doc.moveDown(2);

    // ---------------- Doctor ----------------
    doc.font('bold').fontSize(14).text('Doctor');

    doc
      .font('regular')
      .fontSize(11)
      .text(
        `Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`,
      )
      .text(`Specialization : ${appointment.doctor.specialization}`)
      .text(`Experience : ${appointment.doctor.experience} Years`)
      .text(`License No. : ${appointment.doctor.licenseNumber}`);

    doc.moveDown();

    // ---------------- Patient ----------------
    doc.font('bold').fontSize(14).text('Patient');

    doc
      .font('regular')
      .fontSize(11)
      .text(
        `Name : ${appointment.patient.user.firstName} ${appointment.patient.user.lastName}`,
      )
      .text(`Gender : ${appointment.patient.user.gender}`)
      .text(`DOB : ${appointment.patient.user.dob}`);

    doc.moveDown();

    // ---------------- Appointment ----------------
    doc.font('bold').fontSize(14).text('Appointment');

    doc
      .font('regular')
      .fontSize(11)
      .text(`Date : ${appointment.date}`)
      .text(`Time : ${appointment.startTime} - ${appointment.endTime}`)
      .text(`Hospital : ${appointment.hospital?.name}`)
      .text(
        `Address : ${appointment.hospital?.address.city}, ${appointment.hospital?.address.state}`,
      );

    doc.moveDown();

    // ---------------- Symptoms ----------------
    doc.font('bold').fontSize(14).text('Symptoms');

    doc.font('regular').fontSize(11);

    if (prescription.symptoms?.length) {
      prescription.symptoms.forEach((symptom) => doc.text(`• ${symptom}`));
    } else {
      doc.text('N/A');
    }

    doc.moveDown();

    // ---------------- Diagnosis ----------------
    doc.font('bold').fontSize(14).text('Diagnosis');

    doc.font('regular').fontSize(11);

    if (prescription.diseases?.length) {
      prescription.diseases.forEach((disease) => doc.text(`• ${disease}`));
    } else {
      doc.text('N/A');
    }

    doc.moveDown();

    // ---------------- Medicines ----------------
    doc.font('bold').fontSize(14).text('Medicines');

    doc.moveDown();

    doc
      .font('bold')
      .fontSize(11)
      .text('#', 50)
      .text('Medicine', 80)
      .text('Dosage', 220)
      .text('Frequency', 320)
      .text('Duration', 430);

    let y = doc.y + 8;

    prescription.medicines.forEach((medicine, index) => {
      doc
        .font('regular')
        .fontSize(11)
        .text(String(index + 1), 50, y)
        .text(medicine.name, 80, y)
        .text(medicine.dosage, 220, y)
        .text(medicine.frequency, 320, y)
        .text(medicine.duration, 430, y);

      y += 25;

      if (medicine.note) {
        doc
          .fontSize(10)
          .fillColor('gray')
          .text(`Note: ${medicine.note}`, 80, y);

        y += 20;
        doc.fillColor('black');
      }
    });

    doc.y = y + 10;

    // ---------------- Notes ----------------
    doc.font('bold').fontSize(14).text("Doctor's Notes");

    doc.font('regular').fontSize(11);

    if (prescription.notes?.length) {
      prescription.notes.forEach((note) => doc.text(`• ${note}`));
    } else {
      doc.text('N/A');
    }

    doc.moveDown(4);

    // ---------------- Signature ----------------
    doc.text('_____________________________', {
      align: 'right',
    });

    doc.text(
      `Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`,
      {
        align: 'right',
      },
    );

    doc.text(appointment.doctor.specialization, {
      align: 'right',
    });

    doc.text(`License No. ${appointment.doctor.licenseNumber}`, {
      align: 'right',
    });

    doc.moveDown(2);

    doc
      .fontSize(9)
      .fillColor('gray')
      .text(
        'This is a digitally generated prescription from HealthSync and does not require a physical signature.',
        {
          align: 'center',
        },
      );

    // ================= END =================
    doc.end();
  }
}
