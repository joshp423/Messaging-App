interface MessageSolo {
  id: number;
  senderId: number;
  receiverId: number;
  message: string;
  imageUrl: string;
  timeSent: string;
  sender: {
    username: string;
  },
  receiver: {
    username: string;
  }
}

export type { MessageSolo };
