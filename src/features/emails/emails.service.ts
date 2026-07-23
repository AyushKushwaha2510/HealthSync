import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { EmailVerificationMailDto } from './dto/email-verification-mail.dto';
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entities/opt.entity';
import { LessThan, Repository } from 'typeorm';
import { VerifyMailOtpDto } from './dto/verify-mail-otp.dto';

@Injectable()
export class EmailService {
  private readonly resendApiKey: string;
  private readonly resend: Resend;

  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
  ) {
    this.resendApiKey = this.configService.getOrThrow<string>('resendApiKey');
    this.resend = new Resend(this.resendApiKey);
  }

  // ===== SEND OTP for EMAIL verification =====
  async sendEmailVerificationMail(dto: EmailVerificationMailDto) {
    const generatedOtp = Math.ceil(Math.random() * 100000);

    // encode the OTP
    const hashedOtp = Number(await bcrypt.genSalt(generatedOtp));

    const otp = await this.otpRepository.create({
      email: dto.email,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // store the otp in DB
    await this.otpRepository.save(otp);

    console.log(otp);
    const html = `
      this mail is for verification of your email id 
      plese enter your otp
      ${otp}
    `;
    console.log('req, aa hua', dto);
    const { data, error } = await this.resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['ayush.kushwaha23138@gmail.com'],
      subject: 'OTP confirmations',
      html: '<strong>It works!</strong>',
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

    if (savedOtpDetails.otp !== dto.otp)
      throw new BadRequestException('Invalid OTP');

    const savedOtp = savedOtpDetails.otp;
    const userOtp = dto.otp;
    const hashedOtp = Number(await bcrypt.genSalt(userOtp));

    if (savedOtp !== hashedOtp)
      throw new UnauthorizedException('Incorrect OTP');

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
