import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Message } from "./entities/message.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
  ) {}

  async find() {
    return await this.messageRepository.find();
  }

  async create(body: Partial<Message>) {
    const message = this.messageRepository.create(body);
    return this.messageRepository.save(message);
  }
}
