import { PartialType } from '@nestjs/mapped-types';
import { CreatePrescriptionDto } from './create-prescriptions.dto';

export class UpdatePrescriptionDto extends PartialType(CreatePrescriptionDto) {}
