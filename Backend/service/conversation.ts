import { ConversationRepo } from "../repo/conversations";
import type { configSchema } from "./config";
import type { User } from "./user";

export type SingleConversation = {
  id: number;
  userA: number;
  userB: number;
};

export type Group = {
  id: number;
  users: User[];
  name: string;
}

export class ConversationService {
  private config: configSchema;
  private conversationRepo: ConversationRepo;

  constructor(conversationRepo: ConversationRepo, config: configSchema) {
    this.conversationRepo = conversationRepo;
    this.config = config;
  }

  async existingCheck(id: number) {
    return this.conversationRepo.existingCheck(id);
  }
}
