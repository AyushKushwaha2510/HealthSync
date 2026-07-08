import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { SendRequestToAiDto } from './dto/send-request.dto';
import { PrescriptionService } from '../prescriptions/prescriptions.service';

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

  async analyzePrescription(data: SendRequestToAiDto) {
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
}
