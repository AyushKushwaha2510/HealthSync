import { Controller, Post, Body, Res, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './dto/login-dto';
import { AuthService } from './auth.service';
import { CreateAdminDto } from 'src/admin/dto/create-admin.dto';
import { AdminService } from 'src/admin/admin.service';
import { JwtAuthGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
    private readonly adminService: AdminService,
  ) {}

  @Post('register') // default register as patient
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.registerUser(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDTO: LoginDTO, @Res({ passthrough: true }) res) {
    const { accessToken, user } = (await this.authService.login(loginDTO)).data;

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1 * 24 * 60 * 60 * 1000, // 1-day
    });

    return {
      message: 'Logged in Successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) res) {
    // clear cookie
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return {
      message: 'Logged out successfully',
    };
  }

  @Post('register-as-admin')
  registerAsAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.registerAsAdmin(createAdminDto);
  }
}
