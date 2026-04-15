import { ConversationRepo } from "../repo/conversations";
import type { configSchema } from "./config";
import type { User } from "./user";

export type SingleConversation = {
  userA: number;
  userB: number;
};

export type Group = {
  userIds: number[];
  name: string;
};

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

  async createSolo(userA: number, userB: number) {
    return this.conversationRepo.createSolo(userA, userB);
  }

  async createGroup({ userIds, name }: Group) {
    return this.conversationRepo.createGroup(userIds, name);
  }

  async getAllSolo(id: number) {
    return this.conversationRepo.getAllSolo(id);
  }

  async getAllGroups(id: number) {
    return this.conversationRepo.getAllGroups(id);
  }

  async getSelectedSolo(userId: number, conversationId: number) {
    return this.conversationRepo.getSelectedSolo(userId, conversationId);
  }

  async getSelectedGroup(userId: number, groupId: number) {
    return this.conversationRepo.getSelectedGroup(userId, groupId);
  }
}
