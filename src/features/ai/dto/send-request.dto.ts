import { IsUUID } from 'class-validator';

export class SendRequestToAiDto {
  @IsUUID()
  prescriptionId!: string;
}
