import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";

export enum Role {
    ADMIN = 'admin',
    DOCTOR = 'doctor',
    PATIENT = 'patient'
}

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'first_name' })
    firstName!: string;

    @Column({ name: 'last_name' })
    lastName!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    @Exclude()
    password!: string;

    @Column({ type: 'date' })
    dob!: string;
    
    @Column()
    gender!: string;

    @Column({ name: 'blood_group', nullable: true })
    bloodGroup?: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.PATIENT
    })
    role!: Role
}
