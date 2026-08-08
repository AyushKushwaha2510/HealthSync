import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { SendAnalysisRequestToAiDto } from './dto/send-analysis-request.dto';
import { PrescriptionService } from '../prescriptions/prescriptions.service';
import { SendMessageDto } from './dto/send-message.dto';
import { MessagesService } from '../messages/messages.service';
import { Role } from '../messages/types/messages.type';

@Injectable()
export class AiService {
  private readonly fastApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prescriptionService: PrescriptionService,
    private readonly chatMessageService: MessagesService,
  ) {
    this.fastApiUrl = this.configService.getOrThrow<string>('fastApiUrl');
  }

  async analyzePrescription(data: SendAnalysisRequestToAiDto) {
    const prescriptionDetails = await this.prescriptionService.findOne(
      data.prescriptionId,
    );
    if (!prescriptionDetails) {
      throw new NotFoundException('Prescription not found');
    }

    // removed unwanted elements
    const { id, appointment, ...prescription } = prescriptionDetails;

    const res = await firstValueFrom(
      this.httpService.post(
        `${this.fastApiUrl}/prescriptions/analyze`,
        prescription,
      ),
    );

    if (!res)
      throw new InternalServerErrorException('Failed to analyze prescription');

    return res.data;
  }

  async sendMessage(data: SendMessageDto): Promise<string> {
    const { id, conversationId, message } = data;

    if (!message)
      throw new InternalServerErrorException(
        'Please Write a Message to Continue',
      );

    console.log('human ', data);

    // Save user message in DB
    await this.chatMessageService.create({
      id,
      conversationId,
      content: message,
      role: Role.USER,
      createdAt: new Date(Date.now()),
    });

    const res = await firstValueFrom(
      this.httpService.post(
        `${this.fastApiUrl}/chat/send`,
        { message }, // fastapi expects an object as i have used Pydantic Validation in this Route
      ),
    );

    console.log('ai ', res.data);

    // Save AI response message in DB
    await this.chatMessageService.create({
      id: crypto.randomUUID(),
      conversationId,
      content: res.data,
      role: Role.ASSISTANT,
      createdAt: new Date(Date.now()),
    });

    if (!res)
      throw new InternalServerErrorException(
        'Unable to Answer your request. Please try again',
      );

    return res.data;
  }
}
