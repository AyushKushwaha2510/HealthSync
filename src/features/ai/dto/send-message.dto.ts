import { IsString, IsUUID } from 'class-validator';

export class SendMessageDto {
  @IsUUID()
  id!: string;

  @IsUUID()
  conversationId!: string;

  @IsString()
  message!: string;
}
