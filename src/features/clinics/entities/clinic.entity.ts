import { Address } from 'src/embedded-entities/address/entity/address.entity';
import { Appointment } from 'src/features/appointments/entities/appointment.entity';
import { DoctorsAvailability } from 'src/features/doctors-availability/entities/doctors-availability.entity';
import { Doctor } from 'src/features/doctors/entities/doctor.entity';
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

  @Column()
  latitute!: number;

  @Column()
  longitude!: number;

  @ManyToMany(() => Doctor, (doctor) => doctor.clinics)
  doctors!: Doctor[];

  @OneToMany(() => Appointment, (appointment) => appointment.clinic)
  appointments!: Appointment[];

  @OneToMany(() => DoctorsAvailability, (availability) => availability.clinic)
  availabilities!: DoctorsAvailability[];
}
