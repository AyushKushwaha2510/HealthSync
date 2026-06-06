import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Clinic } from 'src/clinics/entities/clinic.entity';
import { Hospital } from 'src/hospitals/entities/hospital.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('doctors')
export class Doctor {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  specialization!: string;

  @Column({ type: 'int' })
  experience!: number;

  @Column({ name: 'license_number' })
  licenseNumber!: string;

  // each doctor will have only one user profile
  @OneToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  // one doctor can have many appointments
  @OneToMany(() => Appointment, (appointment) => appointment.doctor, {
    nullable: true,
  })
  appointments?: Appointment[];

  @ManyToMany(() => Hospital, (hospital) => hospital.doctors)
  @JoinTable()
  hospitals?: Hospital[];

  @ManyToMany(() => Clinic, (clinic) => clinic.doctors)
  @JoinTable()
  clinics?: Clinic[];
}
