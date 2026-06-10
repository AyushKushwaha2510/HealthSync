import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Clinic } from './entities/clinic.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ClinicsService {
  constructor(
    @InjectRepository(Clinic)
    private readonly clinicRepository: Repository<Clinic>,
  ) {}

  async create(CreateClinicDto: CreateClinicDto) {
    const existingclinic = await this.clinicRepository.findOneBy({
      address: CreateClinicDto.address,
      phone: CreateClinicDto.phone,
    });

    if (existingclinic)
      throw new HttpException(
        'This clinic is Already Registered',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const clinic = new Clinic();
    clinic.name = CreateClinicDto.name;
    clinic.address = CreateClinicDto.address;
    clinic.phone = CreateClinicDto.phone;

    const newClinic = await this.clinicRepository.save(clinic);

    if (!newClinic)
      throw new HttpException(
        'Failed to Register Clinic',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    return {
      statusCode: HttpStatus.CREATED,
      message: 'Clinic Registered Successfully',
      data: newClinic,
    };
  }

  async findAll() {
    const clincs = await this.clinicRepository.find();
    if (clincs.length == 0)
      throw new NotFoundException('No Clinic Found in DB');

    return {
      statusCode: HttpStatus.FOUND,
      message: 'Clinics Found',
      data: clincs,
    };
  }

  async findOne(id: string) {
    const clinic = await this.clinicRepository.findOneBy({ id });
    
    return {
      statusCode: HttpStatus.FOUND,
      message: 'Clinic is Found',
      data: clinic,
    };
  }

  update(id: number, updateClinicDto: UpdateClinicDto) {
    return `This action updates a #${id} clinic`;
  }

  remove(id: number) {
    return `This action removes a #${id} clinic`;
  }
}
