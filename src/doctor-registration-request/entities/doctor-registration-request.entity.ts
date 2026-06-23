import { Clinic } from 'src/clinics/entities/clinic.entity';
import { Hospital } from 'src/hospitals/entities/hospital.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Status {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('doctor-registration-requests')
export class DoctorRegistrationRequest {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  specialization!: string;

  @Column({ type: 'int' })
  experience!: number;

  @Column({ name: 'license_number' })
  licenseNumber!: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PENDING,
  })
  status!: Status;

  @ManyToMany(() => Hospital)
  @JoinTable()
  hospitals?: Hospital[];

  @ManyToMany(() => Clinic)
  @JoinTable()
  clinics?: Clinic[];

  @Column({
    name: 'appointment-fee',
    type: 'int',
  })
  appointmentFee!: number;

  // each doctor will have only one user profile
  @OneToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({
    name: 'rejection_reason',
    nullable: true,
  })
  rejectionReason?: string;
}
