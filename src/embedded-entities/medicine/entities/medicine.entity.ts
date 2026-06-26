import { Column } from 'typeorm';

class MedicineInfo {
  @Column({ name: 'medicine_name' })
  name!: string;

  @Column()
  dosage!: string;

  @Column({ nullable: true })
  note?: string;
}
