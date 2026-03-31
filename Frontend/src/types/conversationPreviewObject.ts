import type { MessageSolo } from "./messageSolo";
// import type { messageGroup } from "./messageGroup";

interface ConversationPreviewObject {
  id: number;
  userA: number;
  userB: number;
  messages: MessageSolo[] ;
}

export type { ConversationPreviewObject };
