import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto, Gender } from './create-user.dto';
import { IsDateString, IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsString()
    @IsOptional()
    readonly firstName?: string;

    @IsString()
    @IsOptional()
    readonly lastName?: string;

    @IsEmail()
    @IsOptional()
    readonly email?: string;

    @IsString()
    @IsOptional()
    readonly password?: string;

    @IsDateString()
    readonly dob!: string;

    @IsString()
    readonly bloodGroup?: string;

    @IsString()
    readonly gender!: Gender;
}
