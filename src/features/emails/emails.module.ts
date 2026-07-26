import { Module } from '@nestjs/common';
import { EmailsController } from './emails.controller';
import { EmailService } from './emails.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/opt.entity';
import { EmailTemplate } from './emails.templete';

@Module({
  imports: [TypeOrmModule.forFeature([Otp])],
  controllers: [EmailsController],
  providers: [EmailService, EmailTemplate],
})

export class EmailsModule {}
