import type { MessageSolo } from "./messageSolo";

interface ConversationObject {
  id: number;
  userA: number;
  userB: number;
  messages: MessageSolo[];
}

export type { ConversationObject };
