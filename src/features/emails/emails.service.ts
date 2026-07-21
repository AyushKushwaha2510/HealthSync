import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { EmailVerificationMailDto } from './dto/email-verification-mail.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from './entities/opt.entity';
import { Repository } from 'typeorm';

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

  async sendEmailVerificationMail(dto: EmailVerificationMailDto) {
    const otp = Math.ceil(Math.random() * 100000);

    // encode the OTP
    const hashedOtp = Number(bcrypt.genSalt(otp));

    const newOtp = new Otp();
    newOtp.email = dto.email;
    newOtp.otp = hashedOtp;

    // store the otp in DB
    await this.otpRepository.save(newOtp);

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
}
