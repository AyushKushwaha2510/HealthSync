import { Column } from "typeorm";

// Embedded Entity
export class Address {
  @Column()
  line1!: string;

  @Column({ nullable: true })
  line2?: string;

  @Column()
  city!: string;

  @Column()
  state!: string;

  @Column()
  country!: string;

  @Column()
  pinCode!: string;
}