import { Type } from 'class-transformer';
import { IsPhoneNumber, IsString, ValidateNested } from 'class-validator';
import { AddressDto } from 'src/embedded-entities/address/dto/address.dto';

export class CreateHospitalDto {
  @IsString()
  readonly name!: string;

  @ValidateNested()
  @Type(() => AddressDto)
  readonly address!: AddressDto;

  @IsPhoneNumber('IN')
  readonly phone!: string;
}
