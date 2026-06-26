import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MedicineInfoDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsNotEmpty()
  readonly dosage!: string;

  @IsString()
  @IsOptional()
  readonly note?: string;
}
