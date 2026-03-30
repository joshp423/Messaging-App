import type { messageSolo } from "./messageSolo";
// import type { messageGroup } from "./messageGroup";

interface conversationPreview {
  id: number;
  userA: number;
  userB: number;
  messages: messageSolo ;
}

export type { conversationPreview };
