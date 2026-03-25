interface messageGroup {
  id: number;
  senderId: number;
  groupId: number;
  message: string;
  imageUrl: string;
  timeSent: string;
}

export type { messageGroup };
