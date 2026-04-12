import type { PrismaClient } from "@prisma/client";

export class UserRepo {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(username: string, password: string, email: string) {
    return await this.prisma.users.create({
      data: {
        username,
        email,
        password,
      },
    });
  }
  
  async get(email: string) {
    return await this.prisma.users.findUnique({
      where: {
        email,
      }, 
    })
  }
  
  async update(id: number, username: string, pfpUrl: string, blurb: string) {
    return await this.prisma.users.update({
      where: { id },
      data: {
        username,
        pfpUrl,
        blurb,
      },
    });
  }
}
