import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { FindMessageDto } from './dto/find-message-dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto) {
    const newMessage = this.messageRepository.create(createMessageDto);
    return await this.messageRepository.save(newMessage);
  }

  findAll(findMessageDto: FindMessageDto) {
    return this.messageRepository.findBy(findMessageDto);
  }
}
