import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn, Unique } from "typeorm";

enum Role {
    Admin = 'admin',
    Doctor = 'doctor',
    Patient = 'patient'
}

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    firstname!: string;

    @Column()
    lastname!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ select: false })
    @Exclude()
    password!: string;

    @Column({ type: 'date' })
    dob!: Date;

    @Column()
    gender!: string;

    @Column({ nullable: true })
    blood_group!: string;

    @Column({
        type: 'enum',
        enum: Role
    })
    role!: Role
}
