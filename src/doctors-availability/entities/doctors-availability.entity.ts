import { Doctor } from 'src/doctors/entities/doctor.entity';
import { WeekDays } from 'src/types/week.type';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
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
  day!: WeekDays;

  @Column({ name: 'start_time', type: 'time' })
  startTime!: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime!: string;

  @Column({ name: 'slot_duration', default: 15 })
  slotDuration!: number; // minutes
}
