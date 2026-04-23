import type { PrismaClient } from "@prisma/client";

export class ConversationRepo {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async existingCheck(id: number) {
    return await this.prisma.conversationsSolo.findUnique({
      where: {
        id,
      },
    });
  }

  async createSolo(userA: number, userB: number) {
    return await this.prisma.conversationsSolo.create({
      data: {
        userA,
        userB,
      },
    });
  }

  async createGroup(userIds: number[], name: string) {
    return await this.prisma.groups.create({
      // create new group and link it to users by id
      data: {
        name,
        users: {
          connect: userIds.map((id: number) => ({ id })), // array becomes [{ id: number }] objects - go to users and find id
        },
      },
    });
  }

  async getAllSolo(id: number) {
    return await this.prisma.conversationsSolo.findMany({
      where: {
        OR: [{ userA: id }, { userB: id }],
      },
      include: {
        messages: {
          take: 1, //just one message for preview
          orderBy: { timeSent: "desc" }, // latest message first
          include: {
            sender: {
              select: {
                username: true,
                pfpUrl: true,
              },
            },
            receiver: {
              select: {
                username: true,
                pfpUrl: true,
              },
            },
          },
        },
      },
    });
  }

  async getAllGroups(id: number) {
    return await this.prisma.groups.findMany({
      where: {
        users: {
          some: {
            id,
          },
        },
      },
      include: {
        messages: {
          take: 1,
          orderBy: {
            timeSent: "desc",
          },
          include: {
            sender: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });
  }

  async getSelectedSolo(userId: number, conversationId: number) {
    return await this.prisma.conversationsSolo.findFirst({
      where: {
        OR: [{ userA: userId }, { userB: userId }],
        AND: { id: conversationId },
      },
      include: {
        messages: {
          orderBy: { timeSent: "asc" },
          include: {
            sender: {
              select: {
                username: true,
                pfpUrl: true,
              },
            },
            receiver: {
              select: { username: true },
            },
          },
        },
      },
    });
  }

  async getSelectedGroup(userId: number, groupId: number) {
    return await this.prisma.groups.findFirst({
      where: {
        id: groupId,
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        messages: {
          orderBy: {
            timeSent: "asc",
          },
          include: {
            sender: {
              select: {
                username: true,
              },
            },
          },
        },
      },
    });
  }
}
