import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from './dto/login-dto';
import { UsersService } from 'src/features/users/users.service';
import { JwtPayloadType } from 'src/types/payload.types';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from 'src/features/users/entities/user.entity';
import { AdminService } from 'src/features/admin/admin.service';
import { Admin } from 'src/features/admin/entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly adminService: AdminService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDTO: LoginDTO): Promise<{
    statusCode: number;
    message: string;
    data: {
      accessToken: string;
      user: {
        email: string;
        userId: string;
        role: Role;
      };
    };
  }> {
    let user: User | Admin | null = await this.userService.findByEmail(
      loginDTO.email,
    );

    if (!user) {
      user = await this.adminService.findByEmail(loginDTO.email);
    }

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    console.log('req aa gya login ka', user);

    const isPasswordMatched: boolean = await bcrypt.compare(
      loginDTO.password,
      user.password,
    );

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
        role,
      };

      const accessToken = this.jwtService.sign(payload);

      return {
        statusCode: HttpStatus.OK,
        message: 'Logged In Successfully',
        data: {
          accessToken,
          user: {
            ...payload,
          },
        },
      };
    } else {
      throw new HttpException(
        'Passsword does not match the original password',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
