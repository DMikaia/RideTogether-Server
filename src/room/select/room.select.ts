import { Prisma } from '@prisma/client';

export const roomSelect: Prisma.OfferSelect = {
  room: {
    select: {
      id: true,
      name: true,
    },
  },
};
