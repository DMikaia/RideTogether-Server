import { Prisma } from '@prisma/client';

export const MessageSelect: Prisma.MessageSelect = {
  createdAt: true,
  content: true,
  sender: {
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
    },
  },
};
