import { IsPhoneNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AddressDto } from 'src/address/dto/address.dto';

export class CreateClinicDto {
  @IsString()
  readonly name!: string;

  @ValidateNested()
  @Type(() => AddressDto)
  readonly address!: AddressDto;

  @IsPhoneNumber('IN')
  readonly phone!: string;
}
