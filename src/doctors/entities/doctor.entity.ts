import { Appointment } from "src/appointments/entities/appointment.entity";
import { Patient } from "src/patients/entities/patient.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Doctor {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    specialization!: string;

    @Column({ type: 'int' })
    experience!: number;

    @Column()
    hospital!: string;

    @Column({ name: 'license_number' })
    licenseNumber!: string;

    // each doctor will have only one user profile
    @OneToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user!: User

    // one doctor can have many appointments
    @OneToMany(() => Appointment, appointment => appointment.doctor)
    appointments!: Appointment[];
}
