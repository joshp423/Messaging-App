interface MessageGroup {
  id: number;
  senderId: number;
  groupId: number;
  message: string;
  imageUrl: string;
  timeSent: string;
  sender: {
    username: string;
  },
}

export type { MessageGroup };
