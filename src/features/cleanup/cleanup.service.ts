import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Otp } from '../emails/entities/opt.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class CleanupService {
  
  constructor(
    @InjectRepository(Otp)
    private readonly otpRepository: Repository<Otp>,
  ) {}

  @Cron(CronExpression.EVERY_2ND_HOUR)
  async cleanupExpiredOtps() {
    const result = await this.otpRepository.delete({
      expiresAt: LessThan(new Date()),
    });

    if (result.affected) {
      console.log(`Deleted ${result.affected} expired OTP(s)`);
    }
  }
}
