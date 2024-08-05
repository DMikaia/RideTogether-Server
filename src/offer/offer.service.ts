import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CurrentOffer, Offer } from './dto/offer.dto';
import { offerSelect, currentOfferSelect } from './select/offer.select';

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
      select: offerSelect,
    });
  }

  async getAvailableOffers(): Promise<Offer[]> {
    return await this.prismaService.client.offer.findMany({
      where: {
        closed: false,
      },
      select: offerSelect,
    });
  }

  async getMyCurrentOffer(userId: string): Promise<CurrentOffer[]> {
    return await this.prismaService.client.offer.findMany({
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
      select: currentOfferSelect,
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
        participants: {
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
  }
}
