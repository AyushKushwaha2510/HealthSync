import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Doctor } from './entities/doctor.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Role, User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
  ) {}

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

  // ==== PROFILE ==== //
  async profile(userId: string, doctorId: string) {
    const doctor = await this.doctorRepository.findOne({
      where: {
        id: doctorId,
      },
      relations: {
        user: true,
      },
    });

    if (!doctor) throw new NotFoundException('Doctor Not Found');

    return {
      statusCode: HttpStatus.FOUND,
      message: 'success',
      data: doctor,
    };
  }

  async findAll(specialization?: string, hospital?: string) {
    const criteria = {
      ...(specialization && { specialization }),
      ...(hospital && { hospital }),
    };

    const doctors = await this.doctorRepository.find({
      where: criteria,
      relations: {
        user: true,
      },
    });

    if (doctors.length === 0) {
      throw new NotFoundException('No doctors found');
    }

    return {
      statusCode: HttpStatus.FOUND,
      message: 'Doctors Found',
      data: doctors,
    };
  }

  async findOne(id: string) {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: {
        // i think after getting into to doctors profile, admin should only get the user reltion, and other relation arae to be fetched after selection from admin dashbord
        user: true,
        appointments: true,
        hospitals: true,
        clinics: true,
      },
    });

    if (!doctor) throw new NotFoundException('Doctor Not Found');
    return {
      statusCode: HttpStatus.FOUND,
      message: 'success',
      data: doctor,
    };
  }

  async findOneWithAvailableSlots(
    id: string,
    date: string,
    hospitalId?: string,
    clinicId?: string,
  ) {
    const criteria = {
      ...(hospitalId && { id: hospitalId }),
      ...(clinicId && { id: clinicId }),
    };
    const doctor = await this.doctorRepository.findOne({
      where: {
        id,
        hospitals: {
          id: hospitalId,
        },
        appointments: {
          appointmentDateTime: Between(
            new Date(`${date}T00:00:00`),
            new Date(`${date}T23:59:59`),
          ),
        },
      },
      relations: {
        user: true,
        appointments: true,
        hospitals: true,
        clinics: true,
      },
    });

    if (!doctor) throw new NotFoundException('Doctor Not Found');
    return {
      statusCode: HttpStatus.FOUND,
      message: 'success',
      data: doctor,
    };
  }

  async findOneByUserId(id: string) {
    const doctor = await this.doctorRepository.findOne({
      where: {
        user: {
          id,
        },
      },
      relations:{
        user:true
      }
    });

    if (!doctor) throw new NotFoundException('This user is not a Doctor');

    return {
      statusCode: HttpStatus.FOUND,
      message: 'Doctor is Found',
      data: doctor,
    };
  }

  // TODO: make a findOne, for patient,
  // patient will also get same info as admin but only data of available appointments

  update(id: number, updateDoctorDto: UpdateDoctorDto) {
    return `This action updates a #${id} doctor`;
  }

  async remove(id: string) {
    const doctor = await this.doctorRepository.delete({ id });
    console.log('delete doctor', doctor);
    if (doctor.affected == 0)
      throw new NotFoundException('Doctor not found, cannot remove');
    return `This action removes a #${id} doctor`;
  }
}
