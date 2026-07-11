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

@Injectable()
export class AiService {
  private readonly fastApiUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly prescriptionService: PrescriptionService,
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
    const { id, message } = data;

    if (!message)
      throw new InternalServerErrorException(
        'Please Write a Message to Continue',
      );

    const res = await firstValueFrom(
      this.httpService.post(
        `${this.fastApiUrl}/chat/send`,
        { message }, // fastapi expects an object as i have used Pydantic Validation in this Route
      ),
    );

    if (!res)
      throw new InternalServerErrorException(
        'Unable to Answer your request. Please try again',
      );

    return res.data;
  }
}
