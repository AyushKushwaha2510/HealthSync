import { Column } from 'typeorm';

export class MedicineInfo {
  @Column({ name: 'medicine_name' })
  name!: string;

  @Column()
  dosage!: string;

  @Column()
  frequency!: string;

  @Column()
  duration!: string;

  @Column({ nullable: true })
  note?: string;
}
