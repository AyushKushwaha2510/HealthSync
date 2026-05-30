import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

export enum Status {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

@Entity()
export class DoctorRegistrationRequest {
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

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.PENDING
    })
    status!: Status;

    // each doctor will have only one user profile
    @OneToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user!: User

    @Column({
        name: 'rejection_reason',
        nullable: true
    })
    rejectionReason?: string
}

