import { AiService } from './ai.service';
import { Body, Controller, Post } from '@nestjs/common';
import { SendRequestToAiDto } from './dto/send-request.dto';

@Controller('analyze')
export class AiController {
  constructor(
    private readonly aiService: AiService,
  ) {}

  @Post('prescription')
  analyzePrescription(
    @Body() dto: SendRequestToAiDto,
  ) {
    return this.aiService.analyzePrescription(dto);
  }
}
