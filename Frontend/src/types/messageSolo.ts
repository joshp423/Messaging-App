interface messageSolo {
  id: number;
  senderId: number;
  receiverId: number;
  message: string;
  imageUrl: string;
  timeSent: string;
  sender: {
    username: string;
  }
}

export type { messageSolo };
