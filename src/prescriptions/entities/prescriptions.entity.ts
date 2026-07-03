import { Appointment } from 'src/appointments/entities/appointment.entity';
import { MedicineInfo } from 'src/embedded-entities/medicine/entities/medicine.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('prescriptions')
export class Prescription {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToOne(() => Appointment, (appointment) => appointment.prescription)
  @JoinColumn({ name: 'appointment_id' })
  appointment!: Appointment;

  @Column({ type: 'jsonb' })
  medicines!: MedicineInfo[];

  @Column({ type: 'text', array: true, nullable: true })
  symptoms?: string[];

  @Column({ type: 'text', array: true, nullable: true })
  diagnosis?: string[];

  @Column({ type: 'text', array: true, nullable: true })
  diseases?: string[];

  @Column({ type: 'text', array: true, nullable: true })
  notes?: string[];
}
