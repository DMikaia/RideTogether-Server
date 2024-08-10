import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { roomSelect } from './select/room.select';
import { Room } from './dto/room.dto';

@Injectable()
export class RoomService {
  constructor(private readonly prismaService: PrismaService) {}

  async getRoomList(userId: string): Promise<Room[]> {
    const offers = await this.prismaService.client.offer.findMany({
      where: {
        closed: false,
        OR: [
          { ownerId: userId },
          {
            participants: {
              some: {
                id: userId,
              },
            },
          },
        ],
      },
      select: roomSelect,
    });

    const rooms: Room[] = offers.map((offer) => {
      return offer.room;
    });

    return rooms;
  }
}
