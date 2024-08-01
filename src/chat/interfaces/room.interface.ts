import { Message } from './message.interface';

export interface Room {
  id: string;
  name: string;
  ownerId: string;
  participants: {
    id: string;
  }[];
  messages: Message[];
}
