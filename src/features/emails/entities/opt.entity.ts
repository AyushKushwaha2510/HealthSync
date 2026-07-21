import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('otps')
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column()
  otp!: number;
}
