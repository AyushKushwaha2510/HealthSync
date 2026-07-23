import { Module } from '@nestjs/common';
import { CleanupService } from './cleanup.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from '../emails/entities/opt.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Otp])],
  providers: [CleanupService],
})

export class CleanupModule {}
