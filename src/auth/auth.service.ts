import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from "bcryptjs";
import { LoginDTO } from './dto/login-dto';
import { UsersService } from 'src/users/users.service';
import { JwtPayloadType } from 'src/types/payload.types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    async login(loginDTO: LoginDTO): Promise<{ accessToken: string }> {

        const user = await this.userService.findOne(loginDTO)

        const isPasswordMatched: boolean = await bcrypt.compare(
            loginDTO.password,
            user.password
        )

        if (isPasswordMatched) {
            const payload: JwtPayloadType = {
                email: user.email,
                userId: user.id,
                role: user.role
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
