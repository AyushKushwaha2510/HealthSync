import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { CreateDoctorRegistrationRequestDto } from './dto/create-doctor-registration-request.dto';
import { UpdateDoctorRegistrationRequestDto } from './dto/update-doctor-registration-request.dto';
import { UsersService } from 'src/users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import {
  DoctorRegistrationRequest,
  Status,
} from './entities/doctor-registration-request.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Hospital } from 'src/hospitals/entities/hospital.entity';
import { Clinic } from 'src/clinics/entities/clinic.entity';
import { Role } from 'src/users/entities/user.entity';

@Injectable()
export class DoctorRegistrationRequestService {
  constructor(
    @InjectRepository(DoctorRegistrationRequest)
    private readonly doctorRegistrationRequestRepository: Repository<DoctorRegistrationRequest>,

    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,

    @InjectRepository(Hospital)
    private readonly hospitalRepository: Repository<Hospital>,

    @InjectRepository(Clinic)
    private readonly clinicRepository: Repository<Clinic>,

    private readonly userService: UsersService,
  ) {}

  async registrationRequestAsDoctor(
    createDoctorRegistrationRequestDto: CreateDoctorRegistrationRequestDto,
    email: string,
  ) {
    // find user form JWT payload
    const user = await this.userService.findOne({ email });
    if (!user) throw new BadRequestException('User Not Found');

    const existingUserDoctor =
      await this.doctorRegistrationRequestRepository.findOne({
        where: {
          user: {
            id: user.id,
          },
        },
      });

    // here check both existing request as well as existing doctor

    if (existingUserDoctor) {
      throw new BadRequestException(
        'you have already requested to registered as doctor',
      );
    }

    const existingDoctorWithLicense =
      await this.doctorRegistrationRequestRepository.findOneBy({
        licenseNumber: createDoctorRegistrationRequestDto.licenseNumber,
      });

    if (existingDoctorWithLicense) {
      throw new BadRequestException(
        'Doctor already exists with this Lisense Number',
      );
    }

    const doctorRequest = new DoctorRegistrationRequest();

    doctorRequest.specialization =
      createDoctorRegistrationRequestDto.specialization;
    doctorRequest.experience = createDoctorRegistrationRequestDto.experience;

    const hospitals = createDoctorRegistrationRequestDto.hospitalIds?.length
      ? await this.hospitalRepository.findBy({
          id: In(createDoctorRegistrationRequestDto.hospitalIds),
        })
      : [];

    const clinics = createDoctorRegistrationRequestDto.clinicIds?.length
      ? await this.clinicRepository.findBy({
          id: In(createDoctorRegistrationRequestDto.clinicIds),
        })
      : [];

    doctorRequest.hospitals = hospitals;
    doctorRequest.clinics = clinics;

    doctorRequest.licenseNumber =
      createDoctorRegistrationRequestDto.licenseNumber;
    doctorRequest.user = user;
    doctorRequest.status = Status.PENDING;
    doctorRequest.appointmentFee =
      createDoctorRegistrationRequestDto.appointmentFee;

    const newDoctorRequest =
      await this.doctorRegistrationRequestRepository.save(doctorRequest);

    const { password, ...userWithoutPassword } = newDoctorRequest.user;

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Your request has been sent to administrator successfully',
      data: {
        ...newDoctorRequest,
        user: userWithoutPassword,
      },
    };
  }

  async findAll() {
    // fetch all the pending request
    const pendingRequest: DoctorRegistrationRequest[] | null =
      await this.doctorRegistrationRequestRepository.find({
        where: {
          status: Status.PENDING,
        },
      });

    if (pendingRequest.length == 0)
      throw new NotFoundException('No pending requests');

    return {
      statusCode: HttpStatus.FOUND,
      message: 'Found All Requests',
      data: pendingRequest,
    };
  }

  async findOne(id: string) {
    const pendingRequest: DoctorRegistrationRequest | null =
      await this.doctorRegistrationRequestRepository.findOne({
        where: {
          id,
          status: Status.PENDING,
        },
        relations: {
          user: true,
          hospitals: true,
          clinics: true,
        },
      });

    if (!pendingRequest)
      throw new NotFoundException('This request is not found');

    return {
      statusCode: HttpStatus.FOUND,
      message: 'Found',
      data: pendingRequest,
    };
  }

  async updateStatus(
    id: string,
    status: Status,
    dto?: UpdateDoctorRegistrationRequestDto,
  ) {
    const request = await this.doctorRegistrationRequestRepository.findOneBy({
      id,
    });

    if (!request) throw new NotFoundException('This request is not found');

    request.status = status;
    if (status === Status.REJECTED) {
      if (!dto?.rejectionReason)
        throw new InternalServerErrorException('Rejection Reason is Required');
    }
    request.rejectionReason = dto?.rejectionReason;

    const updatedRequest =
      await this.doctorRegistrationRequestRepository.save(request);

    if (status === Status.APPROVED) {
      // if approved then save user as DOCTOR
      const doctor = await this.doctorRegistrationRequestRepository.findOne({
        where: { id },
        relations: {
          hospitals: {
            doctors: true,
            appointments: true,
          },
          clinics: {
            doctors: true,
            appointments: true,
          },
          user: true,
        },
      });

      if (doctor) {
        // update the role of user
        doctor.user.role = Role.DOCTOR;
        await this.userService.updateRole(doctor.user.id, Role.DOCTOR);

        const newDoctor = this.doctorRepository.create({
          specialization: doctor.specialization,
          experience: doctor.experience,
          licenseNumber: doctor.licenseNumber,
          user: doctor.user,
          hospitals: doctor.hospitals,
          clinics: doctor.clinics,
          appointmentFee: doctor.appointmentFee,
        });
        await this.doctorRepository.save(newDoctor);
      }
    }

    return {
      statusCode: HttpStatus.OK,
      message: `${status.toUpperCase()}`,
      data: updatedRequest,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} doctorRegistrationRequest`;
  }
}
