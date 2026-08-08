import { IsDate, IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Role } from '../types/messages.type';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  readonly id!: string;

  @IsUUID()
  @IsNotEmpty()
  readonly conversationId!: string;

  @IsString()
  @IsNotEmpty()
  readonly content!: string;

  @IsEnum(Role)
  @IsString()
  @IsNotEmpty()
  readonly role !:string;

  @IsDate()
  @IsNotEmpty()
  readonly createdAt!: Date
}
