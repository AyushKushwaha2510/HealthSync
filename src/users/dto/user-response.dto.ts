import { Role } from "../entities/user.entity"; 

export class UserResponseDto {

  id!: string;
  firstName!: string;
  lastName!: string;
  email!: string;
  dob!: Date;
  gender!: string;
  bloodGroup!: string;
  role!: Role;
  
}