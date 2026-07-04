import { UserResponseDto } from "./user-response.dto";

export class RegisterResponseDto {

  statusCode!: number;
  message!: string;
  data!: UserResponseDto;

}