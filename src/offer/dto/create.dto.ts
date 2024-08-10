import { Prisma } from '@prisma/client';

export const createOffer = {
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
};
