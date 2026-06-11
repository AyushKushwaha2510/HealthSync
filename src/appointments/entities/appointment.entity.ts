import { Clinic } from 'src/clinics/entities/clinic.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Hospital } from 'src/hospitals/entities/hospital.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Status {
  PENDING_PAYMENT = 'pending_payment',
  CONFIRMED = 'confirmed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'appointment_date_time', type: 'timestamp' })
  appointmentDateTime!: Date;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING_PAYMENT,
  })
  status!: Status;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes?: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments)
  @JoinColumn({ name: 'doctor_id' })
  doctor!: Doctor;

  @ManyToOne(() => Patient, (patient) => patient.appointments)
  @JoinColumn({ name: 'patient_id' })
  patient!: Patient;

  @ManyToOne(() => Hospital, (hospital) => hospital.appointments, {
    nullable: true,
  })
  @JoinColumn({ name: 'hospital_id' })
  hospital?: Hospital | null;

  @ManyToOne(() => Clinic, (clinic) => clinic.appointments, {
    nullable: true,
  })
  @JoinColumn({ name: 'clinic_id' })
  clinic?: Clinic | null;

  @Column({
    name: 'expires_at',
    type: 'timestamp',
    nullable: true,
  })
  expiresAt?: Date;
}
