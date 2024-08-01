export interface Message {
  createdAt: Date;
  content: string;
  sender: {
    id: string;
    name: string;
    username: string;
    image: string;
  };
}

export interface SendMessage extends Omit<Message, 'createdAt'> {
  room: string;
}
