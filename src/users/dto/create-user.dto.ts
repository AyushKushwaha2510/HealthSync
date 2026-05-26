import { IsDateString, IsEmail, IsEnum, IsOptional, IsString } from "class-validator";

export class CreateUserDto {

    @IsString()
    readonly firstName!: string;

    @IsString()
    readonly lastName!: string;

    @IsEmail()
    readonly email!: string;

    @IsString()
    readonly password!: string;

    @IsDateString()
    readonly dob!: Date;

    @IsString()
    @IsOptional()
    readonly bloodGroup !: string;

    @IsString()
    readonly gender!: string;

}
