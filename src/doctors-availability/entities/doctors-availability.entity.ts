import { Clinic } from 'src/clinics/entities/clinic.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Hospital } from 'src/hospitals/entities/hospital.entity';
import { WeekDays } from 'src/types/week.type';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('doctors-availability')
export class DoctorsAvailability {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.availability, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'doctor_id' })
  doctor!: Doctor;

  @Column()
  weekday!: WeekDays;

  @Column({ name: 'start_time', type: 'time' })
  startTime!: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime!: string;

  @Column({ name: 'slot_duration', default: 15 })
  slotDuration!: number; // minutes

  // available in which clinic or hospital
  @ManyToOne(() => Hospital, (hospital) => hospital.availabilities)
  @JoinColumn({ name: 'hospital_id' })
  hospital?: Hospital;

  @ManyToOne(() => Clinic, (clinic) => clinic.availabilities)
  @JoinColumn({ name: 'clinic_id' })
  clinic?: Clinic;
}
