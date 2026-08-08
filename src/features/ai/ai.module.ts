import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { HttpModule } from '@nestjs/axios';
import { PrescriptionModule } from '../prescriptions/prescriptions.module';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [
    HttpModule, 
    PrescriptionModule, 
    MessagesModule
  ],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
