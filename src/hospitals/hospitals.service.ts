import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateHospitalDto } from './dto/create-hospital.dto';
import { UpdateHospitalDto } from './dto/update-hospital.dto';
import { Hospital } from './entities/hospital.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class HospitalsService {
  constructor(
    @InjectRepository(Hospital)
    private readonly hospitalRepository: Repository<Hospital>,
  ) {}

  async create(createHospitalDto: CreateHospitalDto) {
    const existingHospital = await this.hospitalRepository.findOneBy({
      address: createHospitalDto.address,
      phone: createHospitalDto.phone,
    });

    if (existingHospital)
      throw new HttpException(
        'This Hospital is Already Registered',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const hospital = new Hospital();
    hospital.name = createHospitalDto.name;
    hospital.address = createHospitalDto.address;
    hospital.phone = createHospitalDto.phone;

    const newHospital = await this.hospitalRepository.save(hospital);

    if (!newHospital)
      throw new HttpException(
        'Failed to Register Hospital',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Hospital Registered Successfully',
      data: newHospital,
    };
  }

  async findAll() {
    const hospitals = await this.hospitalRepository.find();
    if (hospitals.length == 0)
      throw new NotFoundException('No Hospital Found in DB');

    return {
      statusCode: HttpStatus.FOUND,
      message: 'Hospitals Found',
      data: hospitals,
    };
  }

  async findAllByDoctorId(doctorId: string) {
    const hospitals = await this.hospitalRepository.find({
      where: {
        doctors: {
          id: doctorId,
        },
      },
    });

    return {
      statusCode: HttpStatus.FOUND,
      message: 'Hospitals are Found',
      data: hospitals,
    };
  }
  
  async findOne(id: string) {
    const hospital = await this.hospitalRepository.findOneBy({ id });

    return {
      statusCode: HttpStatus.FOUND,
      message: 'Hospital is Found',
      data: hospital,
    };
  }

  update(id: number, updateHospitalDto: UpdateHospitalDto) {
    return `This action updates a #${id} hospital`;
  }

  remove(id: number) {
    return `This action removes a #${id} hospital`;
  }
}
