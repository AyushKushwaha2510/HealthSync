import { Appointment } from 'src/appointments/entities/appointment.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentProvider {
  RAZORPAY = 'razorpay',
  STRIPE = 'stripe',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Appointment, (appointment) => appointment.payments)
  appointment!: Appointment;

  @Column()
  amount!: number;

  @Column()
  currency!: string;

  @Column({ enum: PaymentProvider })
  provider!: PaymentProvider; // RAZORPAY

  @Column({ nullable: true })
  externalOrderId!: string;

  @Column({ nullable: true })
  externalPaymentId!: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
  })
  status!: PaymentStatus;

  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt!: Date;
}
