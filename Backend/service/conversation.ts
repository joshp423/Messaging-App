import { ConversationRepo } from "../repo/conversations";
import type { configSchema } from "./config";

export type SingleConversation = {
  id: number;
  userA: number;
  userB: number;
};

export class ConversationService {
  private config: configSchema;
  private conversationRepo: ConversationRepo;

  constructor(conversationRepo: ConversationRepo, config: configSchema) {
    this.conversationRepo = conversationRepo;
    this.config = config;
  }

  async existingCheck({id}: SingleConversation) {
    return this.conversationRepo.existingCheck(id);
  }
}
