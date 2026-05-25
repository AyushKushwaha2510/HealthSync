import { Doctor } from "src/doctors/entities/doctor.entity";
import { Patient } from "src/patients/entities/patient.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

enum Status {
    Pending = 'pending',
    Confirmed = 'confirmed',
    Rejected = 'rejected',
}

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @ManyToOne(() => Doctor)
    doctor!: Doctor;

    @ManyToOne(() => Patient)
    patient!: Patient;

    @Column({ type: 'date' })
    appointment_date!: Date;

    @Column({ type: 'time' })
    appointment_time!: Date;

    @Column({
        type: 'enum',
        enum: Status,
        default: 'pending'
    })
    status!: Status;

    @Column({ nullable: true })
    notes!: string;
}
