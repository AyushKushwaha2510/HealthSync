import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import Razorpay from 'razorpay';
import { ConfigService } from '@nestjs/config';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PaymentsService {
  private readonly razorpay: Razorpay;

  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(Payment)
    private readonly paymentRepositoty: Repository<Payment>,
  ) {
    this.razorpay = new Razorpay({
      key_id: this.configService.getOrThrow<string>('razorpayKeyId'),
      key_secret: this.configService.getOrThrow<string>('razorpayKeySecret'),
    });
  }

  // === CREATE ORDER === //
  createOrder(dto: CreatePaymentDto) {
    const order = this.razorpay.orders.create({
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

    // save the info of payment
    const payment = new Payment();
    payment.amount = Number(paymentDetails.amount);
    payment.currency = paymentDetails.currency;
    payment.receiptId = paymentDetails.receipt;

    return {
      statusCode: HttpStatus.OK,
      message: 'success',
      data: true,
    };
  }

  findAll() {
    return `This action returns all payments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} payment`;
  }

  update(id: number, updatePaymentDto: UpdatePaymentDto) {
    return `This action updates a #${id} payment`;
  }

  remove(id: number) {
    return `This action removes a #${id} payment`;
  }
}
