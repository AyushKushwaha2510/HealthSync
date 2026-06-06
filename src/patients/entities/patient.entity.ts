import { Appointment } from "src/appointments/entities/appointment.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Patient {

    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @OneToMany(() => Appointment, appointment => appointment.patient)
    appointments?: Appointment[];

    @Column({nullable:true})
    disease?: string;
    
}
