import type { PrismaClient } from "@prisma/client";

export class MessageRepo {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(
    senderId: number,
    receiverId: number,
    message: string,
    imageUrl: string,
    conversationId: number,
  ) {
    return await this.prisma.messagesSolo.create({
      data: {
        senderId,
        receiverId,
        message,
        imageUrl,
        conversationId,
      },
    });
  }

  async createGroupMessage(
    senderId: number,
    groupId: number,
    message: string,
    imageUrl: string,
  ) {
    return await this.prisma.messagesGroup.create({
      data: {
        senderId,
        groupId,
        message,
        imageUrl,
      },
    });
  }
}
