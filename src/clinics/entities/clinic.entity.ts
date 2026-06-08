import { Address } from 'src/address/entity/address.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { DoctorsAvailability } from 'src/doctors-availability/entities/doctors-availability.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('clinics')
export class Clinic {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column(() => Address)
  address!: Address;

  @Column({ nullable: true })
  phone?: string;

  @ManyToMany(() => Doctor, (doctor) => doctor.clinics)
  doctors!: Doctor[];

  @OneToMany(() => Appointment, (appointment) => appointment.clinic)
  appointments!: Appointment[];

  @OneToMany(() => DoctorsAvailability, (availability) => availability.clinic)
  availabilities!: DoctorsAvailability[];
}
