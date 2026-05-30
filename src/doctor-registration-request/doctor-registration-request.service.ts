import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateDoctorRegistrationRequestDto } from './dto/create-doctor-registration-request.dto';
import { UpdateDoctorRegistrationRequestDto } from './dto/update-doctor-registration-request.dto';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorRegistrationRequest, Status } from './entities/doctor-registration-request.entity';

@Injectable()
export class DoctorRegistrationRequestService {

  constructor(
    @InjectRepository(DoctorRegistrationRequest)
    private readonly doctorRegistrationRequestRepository: Repository<DoctorRegistrationRequest>,

    private readonly userService: UsersService,
  ) { }

  async registrationRequestAsDoctor(
    createDoctorRegistrationRequestDto: CreateDoctorRegistrationRequestDto,
    email: string
  ) {
    // find user form JWT payload
    const user = await this.userService.findOne({ email })
    if (!user) throw new BadRequestException('User Not Found')

    const existingUserDoctor = await this.doctorRegistrationRequestRepository.findOne({
      where: {
        user: {
          id: user.id
        }
      },
    });

    // here check both existing request as well as existing doctor

    if (existingUserDoctor) {
      throw new BadRequestException(
        'User is already registered as doctor'
      );
    }

    const existingDoctorWithLicense =
      await this.doctorRegistrationRequestRepository.findOneBy({
        licenseNumber: createDoctorRegistrationRequestDto.licenseNumber
      })

    if (existingDoctorWithLicense) {
      throw new BadRequestException(
        'Doctor already exists with this Lisense Number',
      );
    }

    const doctorRequest = new DoctorRegistrationRequest();

    doctorRequest.specialization = createDoctorRegistrationRequestDto.specialization;
    doctorRequest.experience = createDoctorRegistrationRequestDto.experience;
    doctorRequest.hospital = createDoctorRegistrationRequestDto.hospital;
    doctorRequest.licenseNumber = createDoctorRegistrationRequestDto.licenseNumber;
    doctorRequest.user = user;
    doctorRequest.status = Status.PENDING

    const newDoctorRequest = await this.doctorRegistrationRequestRepository.save(doctorRequest);

    const { password, ...userWithoutPassword } = newDoctorRequest.user;

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Your request has been sent to administrator successfully',
      data: {
        ...newDoctorRequest,
        user: userWithoutPassword
      }
    };

  }

  findAll() {
    return `This action returns all doctorRegistrationRequest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctorRegistrationRequest`;
  }

  update(id: number, updateDoctorRegistrationRequestDto: UpdateDoctorRegistrationRequestDto) {
    return `This action updates a #${id} doctorRegistrationRequest`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctorRegistrationRequest`;
  }
}
