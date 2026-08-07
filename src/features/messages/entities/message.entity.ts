import { Role } from 'src/features/messages/types/messages.type';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'conversation_id' })
  conversationId!: string;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role!: string;

  @Column()
  content!: string;

  @Column({
    name: 'created_at',
    type: 'timestamp with time zone',
  })
  createdAt!: Date;
}
