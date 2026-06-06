import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('hospitals')
export class Hospital {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  address!: string;

  @Column({ nullable: true })
  phone?: string;

  @ManyToMany(() => Doctor, (doctor) => doctor.hospitals)
  doctors!: Doctor[];

  @OneToMany(() => Appointment, (appointment) => appointment.hospital)
  appointments!: Appointment[];
}
