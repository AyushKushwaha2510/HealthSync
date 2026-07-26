import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('otps')
export class Otp {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column()
  otp!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;
}
