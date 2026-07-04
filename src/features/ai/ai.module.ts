import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { HttpModule } from '@nestjs/axios';
import { PrescriptionModule } from '../prescriptions/prescriptions.module';

@Module({
  imports: [HttpModule, PrescriptionModule],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
