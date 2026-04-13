import type { MessageRepo } from "../repo/messages";
import type { configSchema } from "./config";

export type SingleMessage = {
  senderId: number;
  receiverId: number;
  message: string;
  imageUrl: string;
  conversationId: number;
};

export class MessageService {
  private config: configSchema;
  private messageRepo: MessageRepo;

  constructor(messageRepo: MessageRepo, config: configSchema) {
    this.messageRepo = messageRepo;
    this.config = config;
  }

  async create({
    senderId,
    receiverId,
    message,
    imageUrl,
    conversationId,
  }: SingleMessage) {
    return this.messageRepo.create(
      senderId,
      receiverId,
      message,
      imageUrl,
      conversationId,
    );
  }
}
