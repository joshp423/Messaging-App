interface MessageSolo {
  id: number;
  senderId: number;
  receiverId: number;
  message: string;
  imageUrl: string;
  timeSent: string;
  sender: {
    username: string;
    pfpUrl: string;
  };
  receiver: {
    username: string;
    pfpUrl: string;
  };
}

export type { MessageSolo };
