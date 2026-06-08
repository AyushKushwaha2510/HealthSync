import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Patient } from 'src/patients/entities/patient.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const user = new User();

    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.email = createUserDto.email;

    const salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(createUserDto.password, salt);

    user.dob = createUserDto.dob;
    user.bloodGroup = createUserDto.bloodGroup;
    user.gender = createUserDto.gender;

    user.role = Role.PATIENT;

    const saved_user = await this.userRepository.save(user);

    const { password, ...result } = saved_user;

    const patient = this.patientRepository.create({
      user: saved_user,
    });

    await this.patientRepository.save(patient);

    return {
      statusCode: HttpStatus.CREATED,
      message: 'User registered successfully',
      data: result,
    };
  }

  findAllUsers() {
    return `This action returns all users`;
  }

  async findOne(data: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email: data.email,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        dob: true,
        gender: true,
        role: true,
        bloodGroup: true,
      },
    });

    if (!user) throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: {
        email: email,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        dob: true,
        gender: true,
        role: true,
        bloodGroup: true,
        password: true,
      },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async updateRole(id: string, role: Role) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException('This user if Not Found');
    user.role = role;

    await this.userRepository.save(user);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
