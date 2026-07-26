import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './emails.service';
import { EmailVerificationMailDto } from './dto/email-verification-mail.dto';
import { VerifyMailOtpDto } from './dto/verify-mail-otp.dto';

@Controller('emails')
export class EmailsController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-email-verification-mail')
  sendEmailVerificationMail(@Body() data: EmailVerificationMailDto) {
    return this.emailService.sendEmailVerificationMail(data);
  }

  @Post('verify-mail-otp')
  verifyMailOtp(@Body() data: VerifyMailOtpDto) {
    return this.emailService.verifyMailOtp(data);
  }
}
