import { Role } from 'src/features/users/entities/user.entity';

export interface JwtPayloadType {
  email: string;
  userId: string;
  role: Role;
}
