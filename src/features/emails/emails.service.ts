import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { EmailVerificationMailDto } from './dto/email-verification-mail.dto';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entities/opt.entity';
import { LessThan, Repository } from 'typeorm';
import { VerifyMailOtpDto } from './dto/verify-mail-otp.dto';
import { EmailTemplate } from './emails.templete';

@Injectable()
export class EmailService {
  private readonly resendApiKey: string;
  private readonly resend: Resend;

  constructor(
    private readonly configService: ConfigService,
    private readonly emailTemplete: EmailTemplate,

    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
  ) {
    this.resendApiKey = this.configService.getOrThrow<string>('resendApiKey');
    this.resend = new Resend(this.resendApiKey);
  }

  // ===== SEND OTP for EMAIL verification =====
  async sendEmailVerificationMail(dto: EmailVerificationMailDto) {
    // delete old OTPs for this email
    await this.otpRepository.delete({ email: dto.email });

    const generatedOtp = String(Math.floor(100000 + Math.random() * 900000));

    // encode the OTP
    const hashedOtp = await bcrypt.hash(generatedOtp, 10);

    const otp = this.otpRepository.create({
      email: dto.email,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // store the otp in DB
    await this.otpRepository.save(otp);

    const { data, error } = await this.resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['ayush.kushwaha23138@gmail.com'],
      subject: 'OTP confirmations',
      html: this.emailTemplete.otpMail(generatedOtp),
    });

    if (error) throw new InternalServerErrorException('Unable to Send Email');
  }

  // ===== VERIFY OTP =====
  async verifyMailOtp(dto: VerifyMailOtpDto) {
    const savedOtpDetails = await this.otpRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (!savedOtpDetails) throw new NotFoundException('OTP not found');

    if (savedOtpDetails.expiresAt < new Date())
      throw new BadRequestException('OTP has expired');

    const savedOtp = savedOtpDetails.otp;
    const userOtp = dto.otp;

    // Check validity
    const isMatch = await bcrypt.compare(String(userOtp), savedOtp);

    if (!isMatch) {
      throw new BadRequestException('Invalid OTP');
    }

    // remove saved otp for this email
    await this.otpRepository.delete({
      email: dto.email,
    });

    // delete all expired OTP
    await this.otpRepository.delete({
      expiresAt: LessThan(new Date()),
    });

    return {
      statusCode: HttpStatus.OK,
      success: true,
      message: 'OTP verified',
    };
  }
}
