import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Admin {
    @PrimaryGeneratedColumn('uuid')
    id!:string;

    @Column()
    firstName!:string;

    @Column()
    lastName!:string;

    @Column()
    email!:string;

    @Column()
    password!:string;

    @Column()
    phone!:string;
}
