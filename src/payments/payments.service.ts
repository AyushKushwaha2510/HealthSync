import {
  BadRequestException,
  GatewayTimeoutException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import Razorpay from 'razorpay';
import { ConfigService } from '@nestjs/config';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { Status } from 'src/appointments/entities/appointment.entity';

@Injectable()
export class PaymentsService {
  private readonly razorpay: Razorpay;

  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    private readonly appointmentService: AppointmentsService,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.getOrThrow<string>('razorpayKeyId'),
      key_secret: this.configService.getOrThrow<string>('razorpayKeySecret'),
    });
  }

  // === CREATE ORDER === //
  async createOrder(dto: CreatePaymentDto) {
    const order = await this.razorpay.orders.create({
      amount: dto.amount * 100, // rs -> paise
      currency: 'INR',
      receipt: `RCPT-${Date.now()}`,
    });

    return {
      statusCode: HttpStatus.CREATED,
      message: 'success',
      data: order,
    };
  }

  // === VERIFY SIGN === //
  async verifySignature(dto: VerifyPaymentDto) {
    const generatedSignature = crypto
      .createHmac(
        'sha256',
        this.configService.getOrThrow<string>('razorpayKeySecret'),
      )
      .update(`${dto.externalOrderId}|${dto.externalPaymentId}`)
      .digest('hex');

    if (generatedSignature !== dto.externalSignature) {
      throw new BadRequestException('Invalid payment signature');
    }

    const paymentDetails = await this.razorpay.orders.fetch(
      dto.externalPaymentId,
    );

    // fetch appointment
    const appointment = (
      await this.appointmentService.findOne(dto.appointmentId)
    ).data;

    if (!appointment)
      throw new InternalServerErrorException(
        'An Error Occured While Fetching Appointment Details',
      );

    if (appointment.expiresAt > new Date(Date.now())) {
      await this.appointmentService.update(dto.appointmentId, {
        status: Status.CONFIRMED,
      });
    } else { // TODO: this doesn't refunds the payment, if fails refund the payment
      await this.appointmentService.update(dto.appointmentId, {
        status: Status.EXPIRED,
      });
      throw new GatewayTimeoutException('Payment Time Out, Please Try Again!');
    }

    // save the info of payment
    const payment = new Payment();
    payment.amount = Number(paymentDetails.amount);
    payment.currency = paymentDetails.currency;
    payment.receiptId = paymentDetails.receipt;
    payment.appointment = appointment;

    await this.paymentRepository.save(payment);

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: true,
    };
  }

  // === START PAYMENT === //

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  // update(id: number, updatePaymentDto: UpdatePaymentDto) {
  //   return `This action updates a #${id} payment`;
  // }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
