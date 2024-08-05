import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { MessageSelect } from './select/message.select';

@Injectable()
export class ChatService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async createRoom(ownerId: string, name: string, offerId: string) {
    return await this.prismaService.client.room.create({
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
    return await this.prismaService.client.room.update({
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
    const room = await this.prismaService.client.room.findFirst({
      where: { name },
      select: {
        id: true,
      },
    });

    return await this.prismaService.client.message.create({
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
      select: MessageSelect,
    });
  }

  async getMessagesByRoom(name: string) {
    return this.prismaService.client.message.findMany({
      where: {
        room: {
          name,
        },
      },
      select: MessageSelect,
    });
  }

  async isUserInRoom(name: string, userId: string) {
    const data = await this.prismaService.client.room.findFirst({
      where: {
        name,
        participants: {
          some: {
            id: userId,
          },
        },
      },
    });

    if (data) {
      return true;
    }

    return false;
  }

  async getUserSocketId(id: string) {
    return await this.redisService.getCachedData<string>(`chat-user:${id}`);
  }

  async addSocketIdToUser(id: string, socketId: string) {
    await this.redisService.setCachedData<string>(
      `chat-user:${id}`,
      socketId,
      0,
    );
  }

  async removeSocketIdFromUser(id: string) {
    await this.redisService.removeData(`chat-user:${id}`);
  }
}
