import { IsString } from "class-validator";

export class CreateAdminDto {
    @IsString()
    readonly firstName!: string;

    @IsString()
    readonly lastName!: string;

    @IsString()
    readonly email!: string;

    @IsString()
    readonly password!: string;

    @IsString()
    readonly phone!: string;
}
