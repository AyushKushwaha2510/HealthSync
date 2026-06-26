import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MedicineInfoDto {
  @IsString()
  @IsNotEmpty()
  readonly name!: string;

  @IsString()
  @IsNotEmpty()
  readonly dosage!: string;

  @IsString()
  @IsNotEmpty()
  readonly frequency!: string;

  @IsString()
  @IsNotEmpty()
  readonly duration!: string;

  @IsString()
  @IsOptional()
  readonly note?: string;
}
