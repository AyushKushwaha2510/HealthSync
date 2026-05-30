import { IsNumber, IsString } from "class-validator";

export class CreateDoctorRegistrationRequestDto {

    @IsString()
    readonly specialization!: string;

    @IsNumber()
    readonly experience!: number;

    @IsString()
    readonly hospital!: string;

    @IsString()
    readonly licenseNumber!: string;
}
