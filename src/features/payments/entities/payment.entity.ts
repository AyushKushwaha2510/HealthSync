import { Appointment } from 'src/features/appointments/entities/appointment.entity';
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

  @Column({
    name: 'receipt_id',
  })
  receiptId?: string;

  @Column({
    enum: PaymentProvider,
    nullable: true,
  })
  provider!: PaymentProvider; // RAZORPAY

  @Column({
    name: 'external_order_id',
    nullable: true,
  })
  externalOrderId!: string;

  @Column({
    name: 'external_payment_id',
    nullable: true,
  })
  externalPaymentId!: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
  })
  status!: PaymentStatus;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt!: Date;
}
