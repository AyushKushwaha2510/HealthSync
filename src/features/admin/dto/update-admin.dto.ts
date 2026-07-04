import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { IsString } from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
    @IsString()
    readonly email!: string;

    @IsString()
    readonly password!: string;

    @IsString()
    readonly phone!: string;
}
