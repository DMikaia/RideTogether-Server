import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { SendMessage } from './interfaces/message.interface';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from './interfaces/action.interface';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger('ChatGateway');

  constructor(private chatService: ChatService) {}

  @WebSocketServer() server: Server = new Server<
    ServerToClientEvents,
    ClientToServerEvents
  >();

  async handleConnection(socket: Socket): Promise<void> {
    const userId = socket.handshake.query.userId as string;
    this.logger.log(`User is connected to the socket with id: ${socket.id}`);
    await this.chatService.addSocketIdToUser(userId, socket.id);
  }

  async handleDisconnect(socket: Socket): Promise<void> {
    const userId = socket.handshake.query.userId as string;
    this.logger.log(`User is leaving socket with id: ${socket.id}`);
    await this.chatService.removeSocketIdFromUser(userId);
  }

  @SubscribeMessage('chat')
  async handleChatEvent(@MessageBody() payload: SendMessage) {
    const { room, ...body } = payload;

    const newMessage = await this.chatService.addNewMessage(
      body.sender.id,
      body.content,
      room,
    );

    const response = { createdAt: newMessage.createdAt, ...body };

    this.server.to(room).emit('chat', response);
    await this.chatService.updateMessage(response, room);
  }

  @SubscribeMessage('join')
  async handleSetClientDataEvent(
    client: Socket,
    { roomName, userId }: { roomName: string; userId: string },
  ) {
    const isPart = await this.chatService.isUserInRoom(roomName, userId);

    if (isPart) {
      this.logger.log(`Socket ID ${client.id} is joining room ${roomName}`);
      client.join(roomName);
    } else {
      this.logger.warn(`User ${userId} is not part of room ${roomName}`);
    }
  }

  @SubscribeMessage('messages')
  async handleGetMessagesEvent(
    client: Socket,
    { roomName, userId }: { roomName: string; userId: string },
  ) {
    const isPart = await this.chatService.isUserInRoom(roomName, userId);

    if (isPart) {
      const messages = await this.chatService.getMessagesByRoom(
        userId,
        roomName,
      );

      client.emit('messages', messages);
    } else {
      this.logger.warn(`User ${userId} is not part of room ${roomName}`);
    }
  }
}
