import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { Room } from './interfaces/room.interface';
import { Message } from './interfaces/message.interface';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private prisma: PrismaService,
    private redisService: RedisService,
  ) {}

  async createRoom(ownerId: string, name: string, offerId: string) {
    return await this.prisma.client.room.create({
      data: {
        name,
        owner: {
          connect: {
            id: ownerId,
          },
        },
        participants: {
          connect: {
            id: ownerId,
          },
        },
        offer: {
          connect: {
            id: offerId,
          },
        },
      },
    });
  }

  async addNewUser(userId: string, roomId: string) {
    return await this.prisma.client.room.update({
      where: { id: roomId },
      data: {
        participants: {
          connect: {
            id: userId,
          },
        },
      },
      select: {
        id: true,
      },
    });
  }

  async addNewMessage(sender: string, content: string, name: string) {
    const room = await this.prisma.client.room.findFirst({
      where: { name },
      select: {
        id: true,
      },
    });

    return await this.prisma.client.message.create({
      data: {
        content,
        sender: {
          connect: {
            id: sender,
          },
        },
        room: {
          connect: { id: room.id },
        },
      },
      select: {
        createdAt: true,
      },
    });
  }

  async createSocketRoom(name: string) {
    const room = await this.prisma.client.room.findFirst({
      where: { name },
      select: {
        id: true,
        name: true,
        messages: {
          select: {
            content: true,
            createdAt: true,
            sender: {
              select: {
                id: true,
                name: true,
                username: true,
                image: true,
              },
            },
          },
        },
        ownerId: true,
        participants: {
          select: {
            id: true,
          },
        },
      },
    });

    if (room) {
      await this.redisService.setCachedData<Room>(
        `socket:${room.name}`,
        room,
        0,
      );

      return room;
    }
  }

  async isUserInRoom(name: string, userId: string) {
    const data = await this.redisService.getCachedData<Room>(`socket:${name}`);

    if (data) {
      return data.participants.find((p) => p.id === userId) ? true : false;
    }

    const room = await this.createSocketRoom(name);

    return room.participants.find((p) => p.id === userId) ? true : false;
  }

  async getUserSocketId(id: string) {
    return await this.redisService.getCachedData<string>(`User:${id}`);
  }

  async addSocketIdToUser(id: string, socketId: string) {
    await this.redisService.setCachedData<string>(`User:${id}`, socketId, 0);
  }

  async removeSocketIdFromUser(id: string) {
    await this.redisService.removeData(`User${id}`);
  }

  async updateMessage(message: Message, name: string) {
    const data = await this.redisService.getCachedData<Room>(`socket:${name}`);

    if (data) {
      data.messages.push(message);

      await this.redisService.updateData<Room>(`socket:${name}`, data, 86400);
    }
  }

  async getMessagesByRoom(userId: string, name: string) {
    const data = await this.redisService.getCachedData<Room>(`socket:${name}`);

    if (data) {
      const user = data.participants.find((e) => e.id === userId);

      if (user) {
        return data.messages;
      }
    }
  }
}
