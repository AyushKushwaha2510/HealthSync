import { IsUUID } from 'class-validator';

export class SendAnalysisRequestToAiDto {
  @IsUUID()
  prescriptionId!: string;

  @IsUUID()
  conversationId!:string;
}
