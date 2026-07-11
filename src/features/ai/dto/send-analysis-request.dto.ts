import { IsUUID } from 'class-validator';

export class SendAnalysisRequestToAiDto {
  @IsUUID()
  prescriptionId!: string;
}
