import { Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './emails.service';
import { EmailVerificationMailDto } from './dto/email-verification-mail.dto';

@Controller('emails')
export class EmailsController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-email-verification-mail')
  sendEmailVerificationMail(
    @Body() data: EmailVerificationMailDto
  ) {
    return this.emailService.sendEmailVerificationMail(data);
  }
}
