import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException, NotImplementedException } from '@nestjs/common';
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
        'you have already requested to registered as doctor'
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

  async findAll() {
    // fetch all the pending request
    const pendingRequest: DoctorRegistrationRequest[] | null =
      await this.doctorRegistrationRequestRepository.find({
        where: {
          status: Status.PENDING
        }
      })

    if (pendingRequest.length == 0) throw new NotFoundException('No pending requests')

    return {
      statusCode: HttpStatus.FOUND,
      message: 'Found All Requests',
      data: pendingRequest
    }
  }

  async findOne(id: string) {
    const pendingRequest: DoctorRegistrationRequest | null =
      await this.doctorRegistrationRequestRepository.findOne({
        where: {
          id,
          status: Status.PENDING,
        },
      });

    if (!pendingRequest) throw new NotFoundException('This request is not found')

    return {
      statusCode: HttpStatus.FOUND,
      message: 'Found',
      data: pendingRequest
    }
  }

  async updateStatus(
    id: string,
    status: Status,
    dto?: UpdateDoctorRegistrationRequestDto
  ) {

    const request = await this.doctorRegistrationRequestRepository.findOneBy({ id })

    if (!request) throw new NotFoundException('This request is not found');

    request.status = status;
    request.rejectionReason = dto?.rejectionReason

    const updatedRequest = await this.doctorRegistrationRequestRepository.save(request);

    return {
      statusCode: HttpStatus.OK,
      message: `request ${status}`,
      data: updatedRequest
    }
  }

  remove(id: number) {
    return `This action removes a #${id} doctorRegistrationRequest`;
  }
}
