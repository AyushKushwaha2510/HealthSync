import { Role } from "src/users/entities/user.entity";

export interface JwtPayloadType {
    email: string;
    userId: string;
    role:Role
}