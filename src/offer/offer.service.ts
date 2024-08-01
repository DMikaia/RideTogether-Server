import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CurrentOffer, Offer } from './dto/offer.dto';

@Injectable()
export class OfferService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserOffer(userId: string): Promise<Offer[]> {
    return await this.prismaService.client.offer.findMany({
      where: {
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
      select: {
        owner: {
          select: {
            username: true,
            image: true,
          },
        },
        seats: true,
        taken: true,
        closed: true,
        departurePlace: true,
        destinationPlace: true,
        departureDate: true,
        image: true,
        vehicle: true,
      },
    });
  }

  async getAvailableOffers(): Promise<Offer[]> {
    return await this.prismaService.client.offer.findMany({
      where: {
        closed: false,
      },
      select: {
        owner: {
          select: {
            username: true,
            image: true,
          },
        },
        closed: true,
        seats: true,
        taken: true,
        departurePlace: true,
        destinationPlace: true,
        departureDate: true,
        image: true,
        vehicle: true,
      },
    });
  }

  async getMyCurrentOffer(userId: string): Promise<CurrentOffer> {
    return await this.prismaService.client.offer.findFirst({
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
      select: {
        owner: {
          select: {
            username: true,
            image: true,
          },
        },
        closed: true,
        seats: true,
        taken: true,
        departurePlace: true,
        destinationPlace: true,
        departureDate: true,
        image: true,
        vehicle: true,
        room: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  async createOffer(
    ownerId: string,
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
      },
      select: {
        id: true,
      },
    });

    return newOffer.id;
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
  }
}
