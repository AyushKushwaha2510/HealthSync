import { AiService } from './ai.service';
import { Body, Controller, Post } from '@nestjs/common';
import { SendAnalysisRequestToAiDto } from './dto/send-analysis-request.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('analyze/prescription')
  analyzePrescription(@Body() dto: SendAnalysisRequestToAiDto) {
    return this.aiService.analyzePrescription(dto);
  }

  @Post('send-message')
  sendMessage(@Body() dto: SendMessageDto) {
    return this.aiService.sendMessage(dto);
  }
}
