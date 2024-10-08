import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Offer } from './dto/offer.dto';
import { offerSelect } from './select/offer.select';

@Injectable()
export class OfferService {
  constructor(private readonly prismaService: PrismaService) {}

  async createOffer(
    ownerId: string,
    room: string,
    offer: Prisma.OfferCreateWithoutOwnerInput,
  ): Promise<string> {
    const newOffer = await this.prismaService.client.offer.create({
      data: {
        ...offer,
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
        room: {
          create: {
            owner: {
              connect: {
                id: ownerId,
              },
            },
            name: room,
            participants: {
              connect: {
                id: ownerId,
              },
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    return newOffer.id;
  }

  async isOfferFull(offerId: string) {
    const offer = await this.prismaService.client.offer.findFirst({
      where: {
        id: offerId,
      },
    });

    if (offer.taken === offer.seats) {
      return true;
    }

    return false;
  }

  async addPariticipant(userId: string, offerId: string): Promise<void> {
    await this.prismaService.client.offer.update({
      where: { id: offerId },
      data: {
        participants: {
          connect: {
            id: userId,
          },
        },
        taken: {
          increment: 1,
        },
      },
      select: {
        id: true,
      },
    });

    await this.prismaService.client.room.update({
      where: {
        offerId,
      },
      data: {
        participants: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async getUserOffer(userId: string): Promise<Offer[]> {
    return await this.prismaService.client.offer.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: offerSelect,
    });
  }

  async getAvailableOffers(userId: string): Promise<Offer[]> {
    return await this.prismaService.client.offer.findMany({
      where: {
        closed: false,
        NOT: {
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
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: offerSelect,
    });
  }
}
