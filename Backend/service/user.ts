import bcrypt from "bcryptjs";
import type { UserRepo } from "../repo/users";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { configSchema } from "./config";


export type User = { username: string; password: string; email: string };

export class UserService {
  private config: configSchema;
  private userRepo: UserRepo;

  constructor(userRepo: UserRepo, config: configSchema) {
    this.userRepo = userRepo;
    this.config = config;
  }

  async create({ username, password, email }: User) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userRepo.create(username, hashedPassword, email);
  }

  async get(email: string) {
    return this.userRepo.get(email);
  }

  async login(
    id: number,
    username: string,
    hashedPassword: string,
  ) {
    if (await bcrypt.compare(hashedPassword, username)) {
      return null;
    }

    const token = jwt.sign({ id, username }, this.config.JWT_SECRET, { expiresIn: "1w" });

    return token;
  }

  async edit(
    id: number,
    username: string,
    pfpUrl: string,
    blurb: string
  ) {
    return this.userRepo.update(id, username, pfpUrl, blurb);
  }

  async getId(username: string) {
    return this.userRepo.getId(username);
  }

  async getIds(usernames: string[]) {
    return this.userRepo.getIds(usernames);
  }

  async initialUpdateEdit(email: string, pfpUrl: string, blurb: string) {
    return this.userRepo.initialUpdate(email, pfpUrl, blurb);
  }


}
