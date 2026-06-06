import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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

  ) { }

  // async registerAsDoctor(
  //   createDoctorDTO: CreateDoctorDto,
  //   email: string
  // ) {

  //   const user = await this.userService.findOne({ email })
  //   if (!user) throw new BadRequestException('User Not Found')

  //   const existingUserDoctor = await this.doctorRepository.findOne({
  //     where: {
  //       user: {
  //         id: user.id
  //       }
  //     },
  //   });

  //   if (existingUserDoctor) {
  //     throw new BadRequestException(
  //       'User is already registered as doctor'
  //     );
  //   }

  //   const existingDoctorWithLicense =
  //     await this.doctorRepository.findOneBy({
  //       licenseNumber: createDoctorDTO.licenseNumber
  //     })

  //   if (existingDoctorWithLicense) {
  //     throw new BadRequestException(
  //       'Doctor already exists with this Lisense Number',
  //     );
  //   }

  //   const doctor = new Doctor();

  //   doctor.specialization = .specialization;
  //   doctor.experience = createDoctorDTO.experience;
  //   doctor.hospitals = createDoctorDTO.hospital
  //   doctor.licenseNumber = createDoctorDTO.licenseNumber;
  //   user.role = Role.DOCTOR;
  //   await this.userRepository.save(user); // TODO: here i am updating the role of user, but if any error comes after, then this state becomes inconsistent.
  //   // use rollback later
  //   doctor.user = user;

  //   const newDoctor = await this.doctorRepository.save(doctor);

  //   const { password, ...userWithoutPassword } = newDoctor.user;

  //   return {
  //     statusCode: HttpStatus.CREATED,
  //     message: 'Docter registered successfully',
  //     data: {
  //       ...newDoctor,
  //       user: userWithoutPassword
  //     }
  //   };

  // }

  async findAll(
    specialization?: string,
    hospital?: string
  ) {

    const criteria = {
      ...(specialization && { specialization }),
      ...(hospital && { hospital }),
    };

    const doctors = await this.doctorRepository.findBy(criteria);

    if (doctors.length === 0) {
      throw new NotFoundException(
        'No doctors found'
      );
    }

    return {
      statusCode: HttpStatus.FOUND,
      message: 'Doctors Found',
      data: doctors
    }

  }

  async findOne(id: string) {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: {
        user: true,
        appointments: true
      }
    });

    if(!doctor) throw new NotFoundException(
      'Doctor Not Found'
    )
    return {
      statusCode:HttpStatus.FOUND,
      message:'success',
      data:doctor
    }
  }

  // TODO: make a findOne, for patient, 
  // patient will also get same info as admin but only data of available appointments

  update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return `This action updates a #${id} doctor`;
  }

  async remove(id: string) {
    const doctor = await this.doctorRepository.delete({ id });
    console.log("delete doctor", doctor)
    if(doctor.affected == 0) throw new NotFoundException(
      'Doctor not found, cannot remove'
    )
    return `This action removes a #${id} doctor`;
  }
}
