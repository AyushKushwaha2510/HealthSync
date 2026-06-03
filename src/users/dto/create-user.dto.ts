import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'others'
}

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: "First Name is required" })
    readonly firstName!: string;

    @IsString()
    @IsNotEmpty({ message: "Last Name is required" })
    readonly lastName!: string;

    @IsEmail({}, { message: "Invalid email format" })
    @IsNotEmpty({ message: "Email is required" })
    readonly email!: string;

    @IsString()
    @IsNotEmpty({ message: "Password is required" })
    readonly password!: string;

    @IsDateString()
    @IsNotEmpty({ message: "Date of Birth is required" })
    readonly dob!: string;

    @IsString()
    @IsOptional()
    readonly bloodGroup?: string;

    @IsEnum(Gender, { message: "Gender must be male, female, or other" })
    @IsNotEmpty({ message: "Gender is required" })
    readonly gender!: Gender;
}
