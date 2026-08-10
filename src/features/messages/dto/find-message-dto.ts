import { IsUUID } from "class-validator";

export class FindMessageDto{
  @IsUUID()
  conversationId!:string;
}