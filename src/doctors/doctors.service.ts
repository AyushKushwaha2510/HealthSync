import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './entities/doctor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DoctorsService {

  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly userService: UsersService
  ) { }

  async registerAsDoctor(
    createDoctorDTO: CreateDoctorDto,
    email: string
  ) {
    // find user form JWT payload
    const user = await this.userService.findOne({ email })
    if (!user) throw new BadRequestException('User Not Found')

    const existingUserDoctor = await this.doctorRepository.findOne({
      where: {
        user: {
          id: user.id
        }
      },
    });

    if (existingUserDoctor) {
      throw new BadRequestException(
        'User is already registered as doctor'
      );
    }

    const existingDoctorWithLicense =
      await this.doctorRepository.findOneBy({
        licenseNumber: createDoctorDTO.licenseNumber
      })

    if (existingDoctorWithLicense) {
      throw new BadRequestException(
        'Doctor already exists with this Lisense Number',
      );
    }

    const doctor = new Doctor();

    doctor.specialization = createDoctorDTO.specialization;
    doctor.experience = createDoctorDTO.experience;
    doctor.hospital = createDoctorDTO.hospital;
    doctor.licenseNumber = createDoctorDTO.licenseNumber;
    user.role = Role.Doctor;
    await this.userRepository.save(user); // TODO: here i am updating the role of user, but if any error comes after, then this state becomes inconsistent.
    // use rollback later
    doctor.user = user;

    const newDoctor = await this.doctorRepository.save(doctor);

    const { password, ...userWithoutPassword } = newDoctor.user;

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Docter registered successfully',
      data: {
        ...newDoctor,
        user: userWithoutPassword
      }
    };

  }

  findAll() {
    return `This action returns all doctors`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctor`;
  }

  update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return `This action updates a #${id} doctor`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctor`;
  }
}
