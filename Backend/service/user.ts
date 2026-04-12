import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import type { UserRepo } from "../repo/users";

export type User = { username: string; password: string; email: string };

export class UserService {
  private userRepo: UserRepo;

  constructor(userRepo: UserRepo) {
    this.userRepo = userRepo;
  }

  async create({ username, password, email }: User) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userRepo.create(username, hashedPassword, email);
  }

  async get(email: string) {
    return this.userRepo.get(email);
  }
}
