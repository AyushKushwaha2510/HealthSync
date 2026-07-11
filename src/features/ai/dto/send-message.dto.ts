import { IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  id!: string;

  @IsString()
  message!: string;
}
