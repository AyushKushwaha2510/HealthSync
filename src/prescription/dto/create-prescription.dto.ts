import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { MedicineInfoDto } from 'src/embedded-entities/medicine/dto/medicine.dto';

export class CreatePrescriptionDto {
  @IsUUID()
  @IsNotEmpty({
    message:
      'Appointment is required for prescription, please select appointment first',
  })
  readonly appointmentId!: string;

  @ValidateNested()
  @Type(() => MedicineInfoDto)
  @IsOptional()
  readonly medicines?: MedicineInfoDto[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly notes?: string[];
}
