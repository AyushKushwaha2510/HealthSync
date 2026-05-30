import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import * as bcrypt from "bcryptjs";
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AdminService {

  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>
  ) { }

  async registerAsAdmin(createAdminDto: CreateAdminDto) {
    // check if admin already exists
    const existingAdmin = await this.adminRepository.findOneBy({
      email: createAdminDto.email
    })

    if (existingAdmin) throw new BadRequestException(
      'This email is already linked to other admin account'
    )

    // create an object of ADMIN
    const admin = new Admin()
    admin.firstName = createAdminDto.firstName;
    admin.lastName = createAdminDto.lastName;
    admin.email = createAdminDto.email;

    const salt = await bcrypt.genSalt();
    admin.password = await bcrypt.hash(createAdminDto.password, salt);

    admin.phone = createAdminDto.phone;

    const newAdmin = await this.adminRepository.save(admin);
    if (!newAdmin) throw new InternalServerErrorException('An error occured while saving your details')

    const { password, ...result } = newAdmin;

    return {
      status: HttpStatus.CREATED,
      message: 'successfully registerd as an Admin',
      data: result
    };
  }

  findAll() {
    return `This action returns all admin`;
  }

  async findOne(data: Partial<Admin>): Promise<Admin> {

    const user = await this.adminRepository.findOneBy({ email: data.email })

    if (!user) throw new HttpException(
      'Admin not found',
      HttpStatus.NOT_FOUND
    );

    return user;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminRepository.findOneBy({ email });
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }
}
