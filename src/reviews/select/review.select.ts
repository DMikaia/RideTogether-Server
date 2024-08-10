import { Prisma } from '@prisma/client';

export const reviewSelect: Prisma.ReviewSelect = {
  id: true,
  createdAt: true,
  text: true,
  stars: true,
  reviewer: {
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
    },
  },
};

export const reviewWithRecipientSelect: Prisma.ReviewSelect = {
  recipient: {
    select: {
      id: true,
    },
  },
  id: true,
  createdAt: true,
  text: true,
  stars: true,
  reviewer: {
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
    },
  },
};
