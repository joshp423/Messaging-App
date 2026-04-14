import type { PrismaClient } from "@prisma/client";

export class ConversationRepo {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  
  async existingCheck(id: number) {
    return await this.prisma.conversationsSolo.findUnique({
        where: {
          id
        }
    });
  }

  async createSingle(userA: number, userB: number) {
    return await this.prisma.conversationsSolo.create({
      data: {
        userA,
        userB,
      }
    });
  }

  


}
