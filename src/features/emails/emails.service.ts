import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { EmailVerificationMailDto } from './dto/email-verification-mail.dto';
import { InternalServerErrorException } from '@nestjs/common';

export class EmailService {
  private readonly resendApiKey: string;
  private readonly resend: Resend;

  constructor(
    private readonly configService: ConfigService
  ) {
    this.resendApiKey = this.configService.getOrThrow<string>('resendApiKey');
    this.resend = new Resend(this.resendApiKey);
  }

  async sendEmailVerificationMail(dto: EmailVerificationMailDto) {
    const otp = Math.ceil(Math.random() * 100000);
    console.log(otp);
    const html = `
      this mail is for verification of your email id 
    `;

    const { data, error } = await this.resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: 'Hello World',
      html: '<strong>It works!</strong>',
    });

    if (error) throw new InternalServerErrorException('Unable to Send Email');
  }
}
