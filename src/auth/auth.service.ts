import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from "bcryptjs";
import { LoginDTO } from './dto/login-dto';
import { UsersService } from 'src/users/users.service';
import { JwtPayloadType } from 'src/types/payload.types';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from 'src/users/entities/user.entity';
import { AdminService } from 'src/admin/admin.service';
import { Admin } from 'src/admin/entities/admin.entity';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UsersService,
        private readonly adminService: AdminService,
        private readonly jwtService: JwtService
    ) { }

    async login(loginDTO: LoginDTO): Promise<{ accessToken: string }> {


        let user: User | Admin | null =
            await this.userService.findByEmail(loginDTO.email);

        if (!user) {
            user = await this.adminService.findByEmail(loginDTO.email);
        }

        if (!user) {
            throw new UnauthorizedException(
                'Invalid email or password',
            );
        }
        console.log('req form ', user)

        const isPasswordMatched: boolean = await bcrypt.compare(
            loginDTO.password,
            user.password
        )

        let role: Role;
        if (user instanceof Admin) {
            role = Role.ADMIN;
        } else {
            role = user.role;
        }

        if (isPasswordMatched) {
            const payload: JwtPayloadType = {
                email: user.email,
                userId: user.id,
                role
            }

            const accessToken = this.jwtService.sign(payload);

            return { accessToken }
        } else {
            throw new HttpException(
                'Passsword does not match the original password',
                HttpStatus.UNAUTHORIZED
            )
        }

    }
}
