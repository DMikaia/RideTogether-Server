import { Message } from './message.interface';
import { User } from './user.interface';

export interface ServerToClientEvents {
  chat: (e: Message) => void;
}

export interface ClientToServerEvents {
  chat: (e: Message) => void;
  join_room: (e: { user: User; roomName: string }) => void;
}
